---
title: Cài game và vào Máy chủ V80
order: 1
updated: 09/10/2026
authors: [Microvn]
tags: [tân thủ, cài đặt, launcher]
---

Vào Máy chủ V80 chỉ cần ba bước: tải gói cài, đặt launcher cạnh file game, rồi đăng nhập. Game là Võ Lâm 3 bản client 2.5.2, chạy trên Windows 7 trở lên.

## Bước 1: Tải gói cài

Tải gói đầy đủ **JXOnline3VN-v2.5.2** và giải nén ra một thư mục, ví dụ `D:\Games\JXOnline3VN-v2.5.2`. Gói này chỉ cần tải một lần, các bản vá sau do launcher tự tải.

Link tải gói cài (Google Drive): [JXOnline3VN-v2.5.2](https://drive.google.com/file/d/1Gh8_ujPGkh1izbkQ5VgJMyVXlE4a_LkN/view?usp=sharing)

Sau khi giải nén, trong thư mục game phải có file `jx3client.exe`. Nếu không thấy, có thể bạn đã giải nén lồng thêm một thư mục con. Mở thư mục con đó ra cho tới khi thấy `jx3client.exe`.

## Bước 2: Đặt launcher

Tải launcher hợp với máy bạn và chép nó vào **cùng thư mục với `jx3client.exe`**:

- Windows 10, 11: [gamelauncher.exe (64-bit)](http://172.105.112.239:8080/vl3/gamelauncher.exe)
- Windows 7: [gamelauncher32.exe (32-bit)](http://172.105.112.239:8080/vl3/gamelauncher32.exe), cần cài thêm WebView2 Runtime 109

Chưa biết chọn bản nào thì xem bài [Launcher 64-bit hay 32-bit](./launcher-64-32-bit.md).

Launcher tự cập nhật game về bản mới nhất mỗi lần mở. Từ giờ, hãy luôn mở game bằng launcher thay vì bấm thẳng `jx3client.exe`, nếu không bạn sẽ chơi trên bản cũ và gặp lỗi đã được sửa.

## Bước 3: Đăng nhập

1. Mở `gamelauncher.exe` (hoặc `gamelauncher32.exe` trên Windows 7).
2. Đợi launcher kiểm tra và tải bản cập nhật xong.
3. Bấm **Vào game**.
4. Đăng nhập bằng tài khoản đã đăng ký, chọn **Máy chủ V80**.

Đăng ký tài khoản tại [jx3-web.vercel.app/register](https://jx3-web.vercel.app/register).

## Gặp lỗi khi cài

Game báo thiếu file hoặc vào game bị văng ngay: mở launcher, bấm **Kiểm tra và sửa file game**. Launcher sẽ so từng file với bản đang phát và tải lại file hỏng.

Launcher trên Windows 7 mở ra trắng trơn hoặc không mở được: thường là máy chưa có WebView2 Runtime 109. Xem cách cài ở bài [Launcher 64-bit hay 32-bit](./launcher-64-32-bit.md).

Vẫn không được thì báo lên Discord theo hướng dẫn ở bài [Báo lỗi ở đâu](../hoi-dap/bao-loi-o-dau.md).
