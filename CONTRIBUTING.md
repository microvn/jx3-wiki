# Cách viết và sửa bài

Bạn không cần biết lập trình hay cài phần mềm gì. Mọi thứ làm trên trình duyệt, ở trang GitHub của wiki. Chỉ cần một tài khoản GitHub (đăng ký miễn phí tại [github.com](https://github.com)).

Mỗi lần bạn sửa, GitHub tạo ra một **đề xuất sửa** (tiếng Anh là *pull request*, viết tắt PR). Người quản lý wiki xem qua rồi mới đưa lên. Bạn không thể làm hỏng wiki, cứ mạnh dạn thử.

## Sửa một bài có sẵn

1. Mở bài cần sửa trên GitHub, ví dụ `tan-thu/cai-game-va-vao-v80.md`.
2. Bấm biểu tượng cây bút (**Edit this file**) ở góc phải phía trên nội dung bài. Lần đầu, GitHub sẽ hỏi tạo bản sao (*fork*) cho bạn, cứ đồng ý.
3. Sửa chữ trong ô soạn thảo.
4. Bấm tab **Preview** để xem bài hiện ra thế nào. Sửa tiếp nếu cần.
5. Bấm nút xanh **Commit changes...**, viết một dòng ngắn nói bạn đã sửa gì, ví dụ "Bổ sung link tải gói cài".
6. Bấm **Propose changes**, rồi **Create pull request** ở trang tiếp theo.

Xong. Bạn sẽ thấy trang đề xuất sửa của mình. Đợi vài chục giây, ô kiểm tra tự động sẽ hiện dấu xanh (đạt) hoặc dấu đỏ (có lỗi).

## Viết bài mới

1. Vào thư mục chuyên mục phù hợp, ví dụ `pho-ban/`.
2. Bấm **Add file** rồi **Create new file**.
3. Đặt tên file: chỉ chữ thường không dấu, số và dấu gạch ngang, đuôi `.md`. Ví dụ `quang-minh-dinh-mat-dao.md`. Tên file cũng là đường dẫn của bài trên trang web, nên đặt ngắn và dễ hiểu.
4. Mở [_template.md](_template.md), chép toàn bộ nội dung sang file mới rồi sửa theo bài của bạn.
5. Làm tiếp từ bước 4 ở phần trên (Preview, Commit, Pull request).

Các chuyên mục: `tan-thu` (Tân thủ), `mon-phai` (Môn phái), `pho-ban` (Phó bản), `nhiem-vu` (Nhiệm vụ), `khinh-cong` (Khinh công), `hoi-dap` (Hỏi đáp). Muốn mở chuyên mục mới thì hỏi trên Discord trước.

## Phần đầu bài (frontmatter)

Mỗi bài bắt đầu bằng vài dòng nằm giữa hai dòng `---`. Đây là thông tin về bài, không hiện thành chữ trong bài:

```
---
title: Tên bài viết
order: 10
updated: 09/10/2026
authors: [TenDiscordCuaBan]
tags: [phó bản, Minh Giáo]
---
```

- `title`: tên bài. **Bắt buộc.**
- `order`: số thứ tự trong chuyên mục, số nhỏ đứng trước. Không ghi thì bài xếp cuối.
- `updated`: ngày sửa gần nhất, dạng ngày/tháng/năm.
- `authors`: tên Discord của người viết, nhiều người thì cách nhau bằng dấu phẩy. Bạn sửa bài của người khác thì thêm tên mình vào cuối.
- `tags`: vài từ khoá để tìm bài.
- `draft`: ghi `draft: true` nếu bài còn viết dở. Trang web gắn nhãn "nháp" cho bài.

## Tin tức (`tin-tuc/`)

Thư mục `tin-tuc/` chứa bài chi tiết cho từng bản cập nhật, sự kiện hay đợt bảo trì. Tin là thông báo chính thức nên mọi thay đổi trong thư mục này phải được quản trị duyệt. Phần đầu bài khác bài wiki:

```
---
title: Khinh công bay tiếp được giữa không trung
date: 08/10/2026
kind: up
version: 0.1.22
---
```

- `title`: tiêu đề tin. **Bắt buộc.**
- `date`: ngày đăng, dạng ngày/tháng/năm. **Bắt buộc.**
- `kind`: `up` (cập nhật), `ev` (sự kiện) hoặc `mt` (bảo trì). **Bắt buộc.**
- `version`: số bản client, ví dụ `0.1.22`. Tin trên launcher có tiêu đề bắt đầu bằng "Bản 0.1.22" sẽ trỏ tới tin có `version: 0.1.22`. Mỗi bản chỉ một tin.

Tên file theo số bản, ví dụ `ban-0-1-22.md`. Đoạn văn đầu tiên là đoạn dẫn, hiện ngay dưới tiêu đề.

## Quy ước viết

- **Không bịa số liệu.** Cấp, chỉ số, toạ độ, tỉ lệ rơi đồ, phần thưởng: chưa chắc thì ghi `[cần bổ sung]`, người khác sẽ điền sau.
- **Tên tiếng Trung** viết dạng Việt/Hán Việt kèm chữ Hán trong ngoặc, ví dụ Minh Giáo (明教), Cái Bang (丐帮).
- Gọi máy chủ là **Máy chủ V80**.
- Đoạn văn ngắn, mỗi đoạn một ý. Dùng tiêu đề `##` để chia mục.
- **Không dùng thẻ HTML** như `<br>`, `<img>`, `<div>`, `<!-- -->`. Trang web sẽ bỏ chúng đi, và kiểm tra tự động sẽ báo lỗi. Muốn xuống dòng thì để một dòng trống.

## Ảnh

- Để ảnh trong thư mục `assets/` của chuyên mục, ví dụ `pho-ban/assets/`. Trên GitHub: vào `pho-ban/`, bấm **Add file** rồi **Upload files**, và gõ `assets/` trước tên file. Hoặc kéo thả ảnh thẳng vào ô soạn thảo, rồi sửa lại đường dẫn cho đúng.
- Mỗi ảnh **không quá 500 KB**. Ảnh chụp màn hình nên lưu dạng `.webp` hoặc `.jpg` để nhẹ.
- Tên file ảnh cũng chỉ dùng chữ thường không dấu, số và dấu gạch ngang, ví dụ `ban-do-truong-an.webp`.
- Chèn ảnh bằng đường dẫn tương đối: `![Bản đồ Trường An](./assets/ban-do-truong-an.webp)`.
- Chỉ dùng ảnh bạn tự chụp hoặc tự vẽ. Không lấy ảnh quảng bá, hình vẽ của VNG hay Kingsoft.

## Liên kết

- Tới bài khác trong wiki: dùng đường dẫn tương đối tới file `.md`. Cùng chuyên mục: `[Launcher](./launcher-64-32-bit.md)`. Khác chuyên mục: `[Báo lỗi](../hoi-dap/bao-loi-o-dau.md)`. Như vậy link chạy được cả trên GitHub lẫn trên trang web.
- Tới một mục trong bài: thêm `#` và tên mục, ví dụ `../tan-thu/cai-game-va-vao-v80.md#bước-2-đặt-launcher`.
- Tới trang ngoài: ghi đầy đủ `https://...`.

## Kiểm tra tự động báo đỏ

Bấm vào chữ **Details** cạnh dấu đỏ, rồi mở bước **Kiểm tra bài viết**. Mỗi lỗi ghi tên file, số dòng và cách sửa, ví dụ:

```
pho-ban/quang-minh-dinh.md:12: Ảnh không tồn tại: ./assets/boss-1.webp
```

Sửa lại file đó (bấm cây bút như lúc đầu, chọn đúng nhánh của bạn), commit, và kiểm tra sẽ chạy lại.

Bí quá thì hỏi trên Discord: [https://discord.gg/tCp2c8gQX](https://discord.gg/tCp2c8gQX).
