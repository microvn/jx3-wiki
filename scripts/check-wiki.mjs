#!/usr/bin/env node
// Kiểm tra nội dung wiki: frontmatter, tên file, link nội bộ, ảnh, HTML thô.
// Chỉ dùng thư viện có sẵn của Node (>= 18), không cần npm install.
//
//   node scripts/check-wiki.mjs            kiểm cả repo
//   node scripts/check-wiki.mjs <thư mục>  kiểm một thư mục wiki khác
//
// Thoát mã 1 nếu có lỗi. Khi chạy trong GitHub Actions, lỗi còn được in dạng
// ::error để hiện ngay trên dòng tương ứng của PR.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.argv[2] || path.join(path.dirname(new URL(import.meta.url).pathname), '..'));
const MAX_IMAGE_BYTES = 500 * 1024;
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif']);
const ROOT_FILES = new Set(['README.md', 'CONTRIBUTING.md', '_template.md', 'LICENSE', '.gitignore', '.gitattributes', '.editorconfig']);
const SKIP_DIRS = new Set(['.git', '.github', 'scripts', 'node_modules']);
const FM_KEYS = new Set(['title', 'order', 'updated', 'authors', 'tags', 'draft']);
// Chuyên mục tin tức: không có _index.md, frontmatter riêng (xem CONTRIBUTING.md).
const NEWS_DIR = 'tin-tuc';
const NEWS_KEYS = new Set(['title', 'date', 'kind', 'version', 'cover']);
const NEWS_KINDS = new Set(['up', 'ev', 'mt']);
const VERSION_RE = /^\d+\.\d+\.\d+$/;
const newsVersions = new Map();
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const IN_ACTIONS = process.env.GITHUB_ACTIONS === 'true';

const errors = [];
const warnings = [];
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');
const err = (file, line, msg) => errors.push({ file: rel(file), line, msg });
const warn = (file, line, msg) => warnings.push({ file: rel(file), line, msg });

// ---------- duyệt cây ----------

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === ROOT && SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// ---------- frontmatter ----------

function parseScalar(raw) {
  let v = raw.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) return v.slice(1, -1);
  if (v.startsWith('[') && v.endsWith(']')) {
    return v.slice(1, -1).split(',').map((s) => parseScalar(s)).filter((s) => s !== '');
  }
  return v;
}

// Trả về { data, lines: {key: số dòng}, bodyStart } hoặc null nếu không có frontmatter.
function parseFrontmatter(file, text) {
  const lines = text.split('\n');
  if (lines[0].replace(/\r$/, '') !== '---') return null;
  const data = {};
  const at = {};
  let lastKey = null;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    if (line === '---') return { data, at, bodyStart: i + 1 };
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s+-\s*(.*)$/);
    if (item && lastKey) {
      if (!Array.isArray(data[lastKey])) data[lastKey] = [];
      data[lastKey].push(parseScalar(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) {
      err(file, i + 1, `Dòng frontmatter không đọc được: "${line.trim()}". Mỗi dòng phải có dạng "tên: giá trị".`);
      continue;
    }
    lastKey = kv[1];
    at[kv[1]] = i + 1;
    data[kv[1]] = kv[2].trim() === '' ? '' : parseScalar(kv[2]);
  }
  err(file, 1, 'Frontmatter mở bằng "---" ở dòng 1 nhưng thiếu dòng "---" đóng lại.');
  return { data, at, bodyStart: lines.length };
}

function validDate(s) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;
  const [d, mo, y] = [+m[1], +m[2], +m[3]];
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
}

function checkNewsFrontmatter(file, fm) {
  if (!fm) {
    err(file, 1, 'Thiếu frontmatter. Tin phải mở đầu bằng "---", các dòng title, date, kind, rồi "---".');
    return;
  }
  const { data, at } = fm;
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    err(file, at.title || 1, 'Thiếu "title" trong frontmatter (bắt buộc).');
  }
  if (!validDate(String(data.date ?? ''))) {
    err(file, at.date || 1, `"date" là ngày đăng, bắt buộc, dạng dd/mm/yyyy, ví dụ 09/10/2026. Đang là "${data.date ?? ''}".`);
  }
  if (!NEWS_KINDS.has(String(data.kind ?? ''))) {
    err(file, at.kind || 1, `"kind" bắt buộc, là up (cập nhật), ev (sự kiện) hoặc mt (bảo trì). Đang là "${data.kind ?? ''}".`);
  }
  if (data.version !== undefined && data.version !== '') {
    const v = String(data.version);
    if (!VERSION_RE.test(v)) {
      err(file, at.version, `"version" phải có dạng 0.1.22. Đang là "${v}".`);
    } else if (newsVersions.has(v)) {
      err(file, at.version, `Bản ${v} đã có tin ${newsVersions.get(v)}. Mỗi bản chỉ một tin.`);
    } else {
      newsVersions.set(v, rel(file));
    }
  }
  for (const k of Object.keys(data)) {
    if (!NEWS_KEYS.has(k)) warn(file, at[k], `Trường "${k}" không dùng cho tin tức (chỉ có title, date, kind, version, cover). Gõ nhầm?`);
  }
}

function checkFrontmatter(file, fm) {
  if (!fm) {
    err(file, 1, 'Thiếu frontmatter. Bài phải mở đầu bằng "---", dòng "title: Tên bài", rồi "---". Xem _template.md.');
    return;
  }
  const { data, at } = fm;
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    err(file, at.title || 1, 'Thiếu "title" trong frontmatter (bắt buộc).');
  }
  if (data.order !== undefined && data.order !== '' && !/^-?\d+$/.test(String(data.order))) {
    err(file, at.order, `"order" phải là số nguyên, đang là "${data.order}".`);
  }
  if (data.updated !== undefined && data.updated !== '' && !validDate(String(data.updated))) {
    err(file, at.updated, `"updated" phải là ngày dạng dd/mm/yyyy, ví dụ 09/10/2026. Đang là "${data.updated}".`);
  }
  if (data.draft !== undefined && data.draft !== '' && data.draft !== 'true' && data.draft !== 'false') {
    err(file, at.draft, `"draft" chỉ nhận true hoặc false. Đang là "${data.draft}".`);
  }
  for (const k of ['authors', 'tags']) {
    if (data[k] !== undefined && data[k] !== '' && !Array.isArray(data[k])) {
      err(file, at[k], `"${k}" phải là danh sách, ví dụ ${k}: [a, b]. Đang là "${data[k]}".`);
    }
  }
  for (const k of Object.keys(data)) {
    if (!FM_KEYS.has(k)) warn(file, at[k], `Trường "${k}" không được dùng (chỉ có title, order, updated, authors, tags, draft). Gõ nhầm?`);
  }
}

// ---------- markdown: bỏ code, tìm link/ảnh/HTML/tiêu đề ----------

// Trả về mảng dòng đã thay code (khối ``` và `inline`) bằng khoảng trắng, giữ nguyên số dòng.
function maskCode(lines, start) {
  const out = lines.map(() => '');
  let fence = null;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i].replace(/\r$/, '');
    const f = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && line.trim() === f[1]) fence = null;
      continue;
    }
    if (f) { fence = f[1]; continue; }
    if (/^( {4}|\t)/.test(line) && (i === start || out[i - 1].trim() === '')) continue; // khối code thụt lề
    out[i] = line.replace(/(`+)([\s\S]*?)\1/g, (m) => ' '.repeat(m.length));
  }
  return out;
}

// Slug tiêu đề theo kiểu GitHub / rehype-slug (github-slugger).
function slugify(text, seen) {
  let s = text.normalize('NFC').toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, '')
    .replace(/ /g, '-');
  const base = s;
  let n = seen.get(base) || 0;
  if (n > 0) s = `${base}-${n}`;
  seen.set(base, n + 1);
  return s;
}

const anchorCache = new Map();
function anchorsOf(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split('\n');
  const fm = parseFrontmatterQuiet(lines);
  const masked = maskCode(lines, fm);
  const seen = new Map();
  const set = new Set();
  for (const line of masked) {
    const h = line.match(/^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/);
    if (!h) continue;
    const plain = h[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_~]/g, '');
    set.add(slugify(plain, seen));
  }
  anchorCache.set(file, set);
  return set;
}
function parseFrontmatterQuiet(lines) {
  if (lines[0].replace(/\r$/, '') !== '---') return 0;
  for (let i = 1; i < lines.length; i++) if (lines[i].replace(/\r$/, '') === '---') return i + 1;
  return lines.length;
}

const LINK_RE = /(!?)\[((?:[^\[\]]|\[[^\]]*\])*)\]\(\s*(<[^>]*>|[^\s)]+)(?:\s+(?:"[^"]*"|'[^']*'|\([^)]*\)))?\s*\)/g;
const REFDEF_RE = /^\s{0,3}\[([^\]]+)\]:\s*(\S+)/;
const HTML_RE = /<!--|<\/?[A-Za-z][A-Za-z0-9-]*(?:\s[^<>]*)?\/?>/g;

function isCategoryArticle(abs) {
  const parts = rel(abs).split('/');
  return parts.length === 2 && parts[1].endsWith('.md');
}

function checkTarget(file, lineNo, isImage, rawTarget) {
  let target = rawTarget.replace(/^<|>$/g, '');
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
    if (isImage && /^https?:/i.test(target)) {
      err(file, lineNo, `Ảnh phải để trong repo (thư mục assets/ cạnh bài), không dùng link ngoài: ${target}`);
    }
    return;
  }
  if (target.startsWith('//')) {
    err(file, lineNo, `Link "${target}" thiếu "https:". Ghi đầy đủ https://...`);
    return;
  }
  if (target.startsWith('#')) {
    const a = decodeSafe(target.slice(1));
    if (a && !anchorsOf(file).has(a)) err(file, lineNo, `Không có mục "${target}" trong bài này.`);
    return;
  }
  if (target.startsWith('/')) {
    err(file, lineNo, `Đường dẫn "${target}" bắt đầu bằng "/". Dùng đường dẫn tương đối, ví dụ ./assets/anh.webp hoặc ../tan-thu/bai.md.`);
    return;
  }
  const [pathPart, anchor] = target.split('#');
  const decoded = decodeSafe(pathPart.split('?')[0]);
  const abs = path.resolve(path.dirname(file), decoded);
  const shown = target;
  if (!abs.startsWith(ROOT + path.sep)) {
    err(file, lineNo, `Đường dẫn "${shown}" trỏ ra ngoài wiki.`);
    return;
  }
  if (!fs.existsSync(abs)) {
    err(file, lineNo, `${isImage ? 'Ảnh' : 'Link'} không tồn tại: ${shown}`);
    return;
  }
  if (fs.statSync(abs).isDirectory()) {
    err(file, lineNo, `Link "${shown}" trỏ tới thư mục. Trỏ thẳng tới file, ví dụ ${decoded.replace(/\/?$/, '/')}_index.md.`);
    return;
  }
  const ext = path.extname(abs).toLowerCase();
  if (isImage) {
    if (!IMAGE_EXT.has(ext)) err(file, lineNo, `"${shown}" không phải ảnh hợp lệ (chỉ nhận ${[...IMAGE_EXT].join(', ')}).`);
    return;
  }
  if (ext === '.md') {
    // Bài trong chuyên mục được web đổi link thành route /wiki/<chuyên-mục>/<bài>,
    // nên chỉ được trỏ tới bài hoặc _index.md của chuyên mục khác.
    if (isCategoryArticle(file) && !isCategoryArticle(abs)) {
      err(file, lineNo, `Bài trong chuyên mục chỉ được link tới bài khác trong chuyên mục. "${shown}" không có trên trang web; dùng link https://github.com/microvn/jx3-wiki/blob/main/${rel(abs)}`);
      return;
    }
    if (anchor && !anchorsOf(abs).has(decodeSafe(anchor))) {
      err(file, lineNo, `Không có mục "#${anchor}" trong ${rel(abs)}.`);
    }
  }
}

function decodeSafe(s) {
  try { return decodeURIComponent(s).normalize('NFC'); } catch { return s.normalize('NFC'); }
}

function checkMarkdown(file) {
  const buf = fs.readFileSync(file);
  const text = buf.toString('utf8');
  if (text.includes('�')) err(file, 1, 'File không phải UTF-8. Lưu lại bằng mã UTF-8.');
  const lines = text.split('\n');
  const name = path.basename(file);
  const r = rel(file);
  const needsFm = r !== 'README.md' && r !== 'CONTRIBUTING.md';
  let bodyStart = 0;
  if (needsFm) {
    const fm = parseFrontmatter(file, text);
    if (r.startsWith(NEWS_DIR + '/') && name !== '_index.md') checkNewsFrontmatter(file, fm);
    else checkFrontmatter(file, fm);
    if (fm) bodyStart = fm.bodyStart;
  }
  const masked = maskCode(lines, bodyStart);
  masked.forEach((line, i) => {
    const n = i + 1;
    for (const m of line.matchAll(HTML_RE)) {
      err(file, n, `Không dùng HTML thô ("${m[0].slice(0, 40)}"). Trang web sẽ bỏ nó đi. Dùng cú pháp Markdown, xem CONTRIBUTING.md.`);
    }
    for (const m of line.matchAll(LINK_RE)) checkTarget(file, n, m[1] === '!', m[3]);
    const ref = line.match(REFDEF_RE);
    if (ref) checkTarget(file, n, false, ref[2]);
  });
  if (name === '_index.md' && r.startsWith(NEWS_DIR + '/')) {
    err(file, 1, `Thư mục ${NEWS_DIR}/ không dùng _index.md. Mỗi file là một tin.`);
  }
  if (name === '_index.md' && rel(file).split('/').length !== 2) {
    err(file, 1, '_index.md chỉ đặt ở thư mục chuyên mục cấp một.');
  }
}

// ---------- chạy ----------

const files = walk(ROOT);
const categories = new Set();

for (const f of files) {
  const r = rel(f);
  const parts = r.split('/');
  const name = parts[parts.length - 1];
  const ext = path.extname(name).toLowerCase();
  const stem = name.slice(0, name.length - path.extname(name).length);

  if (parts.length === 1) {
    if (!ROOT_FILES.has(name)) err(f, 1, `File "${name}" không thuộc wiki. Bài viết phải nằm trong một thư mục chuyên mục (tan-thu/, mon-phai/, ...).`);
    else if (ext === '.md') checkMarkdown(f);
    continue;
  }

  const cat = parts[0];
  categories.add(cat);
  for (const dir of parts.slice(0, -1)) {
    if (!NAME_RE.test(dir)) err(f, 1, `Tên thư mục "${dir}" không hợp lệ. Chỉ dùng a-z, 0-9 và dấu gạch ngang, không dấu, không khoảng trắng.`);
  }
  const inAssets = parts.length === 3 && parts[1] === 'assets';
  if (parts.length > 2 && !inAssets) {
    err(f, 1, `"${r}" nằm quá sâu. Bài để ngay trong thư mục chuyên mục, ảnh để trong <chuyên-mục>/assets/.`);
    continue;
  }

  if (ext === '.md') {
    if (inAssets) { err(f, 1, 'File .md không đặt trong assets/. Thư mục này chỉ chứa ảnh.'); continue; }
    if (name !== '_index.md' && (!NAME_RE.test(stem) || path.extname(name) !== '.md')) {
      err(f, 1, `Tên file "${name}" không hợp lệ. Chỉ dùng a-z, 0-9 và dấu gạch ngang, không dấu, đuôi .md. Ví dụ: quang-minh-dinh.md`);
    }
    checkMarkdown(f);
  } else if (IMAGE_EXT.has(ext)) {
    if (!inAssets) err(f, 1, `Ảnh "${r}" phải nằm trong ${cat}/assets/.`);
    if (!NAME_RE.test(stem) || path.extname(name) !== ext) {
      err(f, 1, `Tên ảnh "${name}" không hợp lệ. Chỉ dùng a-z, 0-9 và dấu gạch ngang, đuôi viết thường. Ví dụ: ban-do-truong-an.webp`);
    }
    const size = fs.statSync(f).size;
    if (size > MAX_IMAGE_BYTES) {
      err(f, 1, `Ảnh nặng ${Math.ceil(size / 1024)} KB, vượt giới hạn 500 KB. Thu nhỏ hoặc lưu sang .webp/.jpg.`);
    }
  } else if (name === '.gitkeep') {
    // giữ thư mục rỗng
  } else {
    err(f, 1, `File "${name}" không được hỗ trợ. Wiki chỉ nhận bài .md và ảnh ${[...IMAGE_EXT].join(', ')}.`);
  }
}

for (const cat of categories) {
  if (cat === NEWS_DIR) continue;
  if (!fs.existsSync(path.join(ROOT, cat, '_index.md'))) {
    err(path.join(ROOT, cat), 1, `Chuyên mục "${cat}/" thiếu file _index.md (tên và thứ tự chuyên mục).`);
  }
}

// ---------- in kết quả ----------

const sortKey = (e) => `${e.file}\u0000${String(e.line).padStart(6, '0')}`;
errors.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
const esc = (s) => s.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');

for (const w of warnings) {
  console.log(`${w.file}:${w.line}: Cảnh báo: ${w.msg}`);
  if (IN_ACTIONS) console.log(`::warning file=${w.file},line=${w.line}::${esc(w.msg)}`);
}
for (const e of errors) {
  console.log(`${e.file}:${e.line}: ${e.msg}`);
  if (IN_ACTIONS) console.log(`::error file=${e.file},line=${e.line}::${esc(e.msg)}`);
}

const nMd = files.filter((f) => f.endsWith('.md')).length;
if (errors.length) {
  console.log(`\nCó ${errors.length} lỗi trong ${new Set(errors.map((e) => e.file)).size} file. Sửa các dòng trên rồi gửi lại.`);
  process.exit(1);
}
console.log(`Đạt: ${nMd} file .md, ${categories.size} chuyên mục, không có lỗi.${warnings.length ? ` ${warnings.length} cảnh báo.` : ''}`);
