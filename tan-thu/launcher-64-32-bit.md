---
title: Launcher 64-bit hay 32-bit
order: 2
group: Cài đặt
updated: 09/10/2026
authors: [Microvn]
tags: [tân thủ, launcher, windows 7]
---

Launcher có hai bản, cùng chức năng, chỉ khác loại Windows chạy được:

- **`gamelauncher.exe`** (64-bit): cho Windows 10 và Windows 11. [Tải bản 64-bit](http://172.105.112.239:8080/vl3/gamelauncher.exe)
- **`gamelauncher32.exe`** (32-bit): cho Windows 7. [Tải bản 32-bit](http://172.105.112.239:8080/vl3/gamelauncher32.exe)

Gói cài đã có sẵn cả hai file, nằm cạnh `jx3client.exe` trong thư mục game. Hai link trên chỉ cần khi bạn lỡ xoá launcher hoặc đang dùng gói cài cũ; tải về thì chép vào cạnh `jx3client.exe`, đặt ở chỗ khác launcher không tìm thấy game.

## Chọn bản nào

Máy chạy Windows 10 hoặc 11 thì dùng bản 64-bit, gần như không cần nghĩ thêm.

Máy chạy Windows 7 thì dùng bản 32-bit. Bản 64-bit không chạy được trên Windows 7, kể cả Windows 7 64-bit.

Không nhớ máy mình là Windows mấy: bấm phím Windows + R, gõ `winver`, Enter. Cửa sổ hiện ra ghi rõ phiên bản Windows.

## Windows 7 cần WebView2 Runtime 109

Giao diện launcher dùng WebView2 của Microsoft để hiển thị. Windows 10, 11 có sẵn thành phần này. Windows 7 thì chưa có, và Microsoft chỉ hỗ trợ Windows 7 tới **WebView2 Runtime bản 109**.

Cách nhận biết máy đang thiếu: mở `gamelauncher32.exe` mà cửa sổ trắng trơn, hoặc không hiện gì.

Cài WebView2 Runtime 109 rồi mở lại launcher. Link tải bản 109 đã kiểm chứng: [cần bổ sung]

## Launcher làm gì

- Mỗi lần mở, launcher so file game trên máy với bản đang phát và tải phần thay đổi.
- Launcher tự cập nhật chính nó, bạn không cần tải lại bằng tay.
- Nút **Kiểm tra và sửa file game** kiểm lại toàn bộ file và tải lại file hỏng.
- Nút **Vào game** mở `jx3client.exe` sau khi cập nhật xong.

Vì launcher luôn đưa file game về đúng bản đang phát, file game bạn tự sửa hoặc thay sẽ bị ghi đè lần mở sau. Addon của bạn trong thư mục `interface/` thì không bị đụng tới, trừ addon mặc định đi kèm game.

## Hỏi đáp nhanh

**Có cần gỡ launcher cũ không?** Không. Chép bản mới đè lên là được, hoặc cứ để launcher tự cập nhật.

Gặp lỗi khác thì xem [Báo lỗi ở đâu](../hoi-dap/bao-loi-o-dau.md).
