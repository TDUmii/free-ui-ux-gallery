# BamBo Login

Trang đăng nhập miễn phí mang phong cách truyện tranh giấy cổ, kết hợp một chú gấu trúc vui vẻ với chiếc đèn kéo dây có phản hồi vật lý.

![Ảnh xem trước BamBo Login](docs/preview.webp)

## Điểm nổi bật

- Kéo dây đèn xuống rồi thả để bật hoặc tắt, có nhún và đàn hồi.
- Khi tắt đèn, ánh sáng và biểu cảm thay đổi; toàn bộ form bị khóa cho tới khi bật lại.
- Khi bật đèn, gấu trúc thức dậy, vẫy tay và chào `Hiii!`.
- Gấu trúc che mắt khi nhập mật khẩu và hé nhìn khi người dùng chọn hiện mật khẩu.
- Chặn nút hiện mật khẩu mặc định của Edge/Windows để không xuất hiện hai biểu tượng mắt.
- Hỗ trợ bàn phím, giảm chuyển động theo tùy chọn hệ điều hành và bố cục responsive.
- Không cần cài dependency hoặc build.

## Chạy dự án

Mở trực tiếp `index.html` trong trình duyệt, hoặc chạy một web server tĩnh tại thư mục này:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Cấu trúc

```text
BamBo-Login/
├── assets/icons/   # favicon và ghi công tài nguyên
├── css/            # nền, đèn, bố cục, gấu, form, theme, responsive
├── docs/           # ảnh giới thiệu
├── js/             # lõi, toast, gấu, form, đèn và khởi tạo
├── index.html
└── README.md
```

## Ghi công

Favicon panda được lấy từ dự án [Twemoji](https://github.com/jdecked/twemoji) và sử dụng theo [CC BY 4.0](https://github.com/jdecked/twemoji/blob/main/LICENSE-GRAPHICS). Chi tiết nằm trong [`assets/icons/ATTRIBUTION.md`](assets/icons/ATTRIBUTION.md).

## Giấy phép

Mã nguồn: [MIT License](../LICENSE). Favicon Twemoji không thuộc MIT License của dự án và tiếp tục áp dụng CC BY 4.0.

© 2026 TDUmii - Free UI/UX.
