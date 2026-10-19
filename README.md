# Wiki Võ Lâm 3 · Máy chủ V80

Đây là wiki cộng đồng của Võ Lâm 3, Máy chủ V80, bản client 2.5.2. Người chơi cùng nhau viết hướng dẫn: cài game, môn phái, phó bản, nhiệm vụ, khinh công và hỏi đáp.

Bài viết là file Markdown (`.md`) đọc được ngay trên GitHub. Trang web Võ Lâm 3 cũng lấy nội dung từ repo này để hiển thị, nên sửa ở đây là cập nhật cả hai nơi.

Muốn viết hoặc sửa bài? Đọc [CONTRIBUTING.md](CONTRIBUTING.md). Không cần biết lập trình, chỉ cần tài khoản GitHub.

## Mục lục

**[Tân thủ](tan-thu/_index.md)**
- [Cài game và vào Máy chủ V80](tan-thu/cai-game-va-vao-v80.md)
- [Launcher 64-bit hay 32-bit](tan-thu/launcher-64-32-bit.md)

**[Môn phái](mon-phai/_index.md)**: chưa có bài, mời bạn viết.

**[Phó bản](pho-ban/_index.md)**: chưa có bài, mời bạn viết.

**[Nhiệm vụ](nhiem-vu/_index.md)**: chưa có bài, mời bạn viết.

**[Khinh công](khinh-cong/_index.md)**: chưa có bài, mời bạn viết.

**[Hỏi đáp](hoi-dap/_index.md)**
- [Báo lỗi ở đâu](hoi-dap/bao-loi-o-dau.md)
- [Hỏi đáp ngày mở cửa](hoi-dap/ngay-mo-cua.md)

**Tin tức** (`tin-tuc/`): bài chi tiết cho từng bản cập nhật, hiện ở trang Tin tức của web.

## Cấu trúc repo

```
tan-thu/       Tân thủ
mon-phai/      Môn phái
pho-ban/       Phó bản
nhiem-vu/      Nhiệm vụ
khinh-cong/    Khinh công
hoi-dap/       Hỏi đáp
tin-tuc/       Tin tức cập nhật (chỉ quản trị duyệt, không có _index.md)
  _index.md    tên và thứ tự của chuyên mục
  ten-bai.md   một bài viết
  assets/      ảnh của các bài trong chuyên mục
_template.md   bài mẫu để chép khi viết bài mới
scripts/       công cụ kiểm tra bài (chạy tự động khi gửi đề xuất sửa)
```

## Kiểm tra trên máy

Ai quen dòng lệnh có thể kiểm tra trước khi gửi, cần Node.js 18 trở lên, không phải cài gì thêm:

```
node scripts/check-wiki.mjs
```

Báo lỗi game hoặc hỏi đáp: kênh Discord của Võ Lâm 3, link ở mục Cộng đồng cuối trang web.
