import type { PagesDictionary } from '../../types';

export const viPages: PagesDictionary = {
  shared: {
    breadcrumbHome: 'Trang chủ',
    lastUpdatedLabel: 'Cập nhật lần cuối',
    lastUpdatedDate: '2026-11-19',
    exploreToolsHeading: 'Khám phá Bộ công cụ',
    relatedPagesHeading: 'Thông tin & Chính sách khác',
    openFeedbackBtn: 'Gửi góp ý',
    viewMyFeedbackBtn: 'Góp ý của tôi',
    openGithubBtn: 'Xem trên GitHub',
    emailLabel: 'Email Hỗ trợ',
    copyEmailBtn: 'Sao chép Email',
    copiedEmailBtn: 'Đã sao chép Email',
    noEmailNotice:
      'Email hỗ trợ trực tiếp chưa được cấu hình cho bản triển khai này. Vui lòng dùng Hộp thoại Góp ý trong ứng dụng hoặc GitHub Issues.',
    privacyFirstBadge: '100% Xử lý Phía Client',
  },
  about: {
    navLabel: 'Giới thiệu',
    title: 'Giới thiệu OmniDev IT-Tools',
    metaTitle: 'Giới thiệu OmniDev IT-Tools — Không gian Công cụ Lập trình 100% Phía Client',
    metaDescription:
      'Tìm hiểu về OmniDev IT-Tools: 28 tiện ích lập trình chạy gốc trên trình duyệt thuộc 7 bộ chuyên biệt, không tải dữ liệu lên máy chủ và hỗ trợ 4 ngôn ngữ.',
    subtitle:
      'Không gian làm việc Bento đơn sắc ưu tiên quyền riêng tư, mang 28 công cụ thiết yếu về lập trình, thiết kế, DevOps và chẩn đoán phần cứng trực tiếp vào trình duyệt của bạn.',
    keywords: [
      'giới thiệu omnidev',
      'công cụ lập trình phía client',
      'tiện ích trình duyệt',
      'it tools bảo mật',
      'công cụ dev offline',
    ],
    sections: [
      {
        heading: 'Xây dựng vì Quyền riêng tư Cục bộ Tuyệt đối',
        body: 'Lập trình viên thường xuyên phải dán JWT nhạy cảm, cấu hình nội bộ, đoạn mã SSH/Nginx, chuỗi băm và tệp media vào các trang web bên thứ ba. OmniDev loại bỏ rủi ro đó bằng cách thực thi mọi phép biến đổi hoàn toàn trong bộ nhớ trình duyệt qua các Web API tiêu chuẩn.',
        bullets: [
          'HTML5 Canvas và Web Crypto API xử lý chuyển đổi ảnh, nén ảnh và tính mã băm SHA-1/256/384/512 ngay trên máy.',
          'Các bộ xử lý JSON, YAML, CSV, Regex, JWT, OKLCH, Chmod và Cron chạy đồng bộ trong bộ nhớ client mà không gọi API ngoài.',
          'Công cụ Đo tốc độ & Độ trễ Mạng chỉ gửi gói tin đến endpoint cùng nguồn `/api/speedtest/*` (<= 4 MiB mỗi lượt) và không lưu trữ payload.',
        ],
      },
      {
        heading: '28 Tiện ích trong 7 Bộ công cụ Chuyên biệt',
        body: 'Mỗi công cụ nằm trong không gian Bento linh hoạt với Bảng lệnh tìm kiếm nhanh (Cmd/Ctrl + K), ghim yêu thích, lưu cấu hình mẫu, chia sẻ trạng thái qua URL và bản địa hóa đầy đủ tiếng Anh, tiếng Việt, tiếng Nhật và tiếng Trung Giản thể.',
        bullets: [
          'Xử lý Ảnh (4 công cụ): Chuyển đổi Ảnh, Nén Ảnh, Ảnh sang Base64, Tối ưu SVG.',
          'Xử lý Tệp (4 công cụ): Chuyển đổi JSON/YAML/CSV, Mã băm & Checksum, Kiểm tra Magic Bytes, So sánh Dòng (Diff).',
          'Xử lý Văn bản (5 công cụ): Chuyển kiểu chữ, Kiểm thử Regex, Giải mã JWT, Tạo ID, Mã hóa Văn bản.',
          'Xử lý Màu sắc (4 công cụ): Chuyển hệ màu & OKLCH, Kiểm tra tương phản WCAG, Tạo bảng màu, CSS Glassmorphism.',
          'Máy tính Kỹ thuật (4 công cụ): Tính Chmod, Phân tích biểu thức Cron, Chuyển đổi Unix Timestamp, Quy đổi Đơn vị & Hệ cơ số.',
          'Bảng tra cứu (3 công cụ): Git & GitHub CLI, Trạng thái & Header HTTP, Tra cứu Linux / Docker / Regex.',
          'Thiết bị & Mạng (4 công cụ): Kiểm tra Bàn phím, Kiểm tra Micro, Kiểm tra Loa, Đo tốc độ Mạng Tự lưu trữ.',
        ],
      },
      {
        heading: 'Kiến trúc Mở & Tùy chọn Đồng bộ Đám mây',
        body: 'Mặc định, OmniDev lưu công cụ đã ghim, cấu hình mẫu, bộ đếm sử dụng và góp ý ngay trong bộ nhớ trình duyệt. Khi người vận hành cấu hình Supabase, các tùy chọn ẩn danh (`user_favorites`, `saved_presets`, `tool_metrics`, `tool_ratings`, `feedback_submissions`) có thể đồng bộ mượt mà không cần đăng ký tài khoản.',
      },
    ],
  },
  help: {
    navLabel: 'Trợ giúp & FAQ',
    title: 'Trợ giúp & Câu hỏi Thường gặp',
    metaTitle: 'Trợ giúp & FAQ — Hướng dẫn Bàn phím, Âm thanh, Speed Test | OmniDev IT-Tools',
    metaDescription:
      'Hướng dẫn sử dụng và xử lý sự cố OmniDev IT-Tools: bảo mật phía client, Chế độ Bắt phím (Esc × 2), quyền Micro HTTPS, giới hạn âm lượng Loa 35% và Speed Test.',
    subtitle:
      'Giải đáp thực tế về cách OmniDev xử lý quyền trình duyệt, chẩn đoán phần cứng, lưu trạng thái cục bộ và phím tắt hệ thống.',
    keywords: [
      'trợ giúp omnidev',
      'hỏi đáp it tools',
      'chế độ bắt phím esc',
      'quyền micro https',
      'loa setsinkid',
      'đo tốc độ mạng nội bộ',
    ],
    sections: [
      {
        heading: 'Bắt đầu nhanh & Phím tắt Không gian làm việc',
        body: 'Mở Bảng lệnh Toàn cục (`Cmd/Ctrl + K`) từ bất kỳ đâu để nhảy thẳng tới 28 công cụ, 20 mẫu lệnh DevOps/Git/HTTP hoặc các trang thông tin.',
        bullets: [
          'Nhấn biểu tượng ngôi sao trên thẻ công cụ hoặc thanh tiêu đề để ghim vào thanh bên và ngăn kéo Yêu thích.',
          'Dùng "Lưu cấu hình" trong mỗi công cụ để lưu bộ tham số tái sử dụng cục bộ (hoặc qua Supabase nếu được bật).',
          'Dùng "Chia sẻ trạng thái" để mã hóa tham số hiện tại thành liên kết `?state=` dễ chia sẻ.',
        ],
      },
      {
        heading: 'Lưu ý về Chẩn đoán Phần cứng & Mạng',
        body: 'Các công cụ phần cứng và mạng sử dụng Web API hiện đại của trình duyệt và có thể yêu cầu bạn cấp quyền truy cập thiết bị một lần.',
        bullets: [
          'Kiểm tra Bàn phím: Bật Chế độ Bắt phím để chặn phím tắt trình duyệt như Cmd/Ctrl+K hay F5 khi thử switch; nhấn `Esc` hai lần liên tiếp hoặc bấm Mở khóa để thoát.',
          'Kiểm tra Micro: Yêu cầu ngữ cảnh bảo mật (`https://` hoặc `http://localhost`) và quyền truy cập micro; âm thanh không bao giờ rời khỏi thiết bị.',
          'Kiểm tra Loa: Khởi động với mức giới hạn an toàn thính giác `35%` và hỗ trợ chuyển đầu ra `setSinkId` trên trình duyệt nhân Chromium.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Dữ liệu của tôi có thực sự được xử lý 100% phía client và không tải lên máy chủ?',
        answer:
          'Có. Toàn bộ 24 công cụ chuyển đổi, tệp, văn bản, màu sắc, máy tính và tra cứu cùng Kiểm tra Bàn phím, Micro, Loa đều chạy hoàn toàn trong bộ nhớ trình duyệt bằng Web Crypto, HTML5 Canvas, Web Audio và MediaRecorder API. Chỉ công cụ Speed Test tùy chọn trao đổi các byte giả ngẫu nhiên tức thời với route cùng nguồn `/api/speedtest/*`.',
      },
      {
        question: 'Làm thế nào để thoát Chế độ Bắt phím trong công cụ Kiểm tra Bàn phím?',
        answer:
          'Khi Chế độ Bắt phím đang bật, các phím tắt như Tab, F5 và Cmd/Ctrl+K được giữ lại để bạn kiểm tra trọn vẹn từng phím. Hãy nhấn `Esc` hai lần nhanh (`Esc × 2`) hoặc bấm nút Mở khóa trên màn hình để nhả quyền bắt phím.',
      },
      {
        question: 'Tại sao Kiểm tra Micro yêu cầu HTTPS hoặc quyền truy cập Micro?',
        answer:
          'Trình duyệt giới hạn `navigator.mediaDevices.getUserMedia` chỉ hoạt động trong ngữ cảnh bảo mật (`https://` hoặc `localhost`) nhằm bảo vệ phần cứng người dùng. Sau khi bạn cấp quyền, OmniDev hiển thị sóng âm, phổ tần theo thời gian thực và phát lại cục bộ mà không tải bất kỳ luồng âm thanh nào lên mạng.',
      },
      {
        question: 'Tính năng đổi đầu ra Loa (`setSinkId`) và giới hạn 35% hoạt động thế nào?',
        answer:
          'OmniDev mặc định đặt trần âm lượng tổng ở mức an toàn `35%` để âm thanh thử nghiệm, quét tần số hay nhiễu trắng/hồng không gây giật mình hoặc hại tai nghe. Trên các trình duyệt hỗ trợ (`HTMLMediaElement.setSinkId` như Chrome/Edge), bạn có thể chọn trực tiếp thiết bị phát đầu ra.',
      },
      {
        question: 'Công cụ Speed Test tự lưu trữ hoạt động ra sao khi không dùng máy chủ bên thứ ba?',
        answer:
          'Speed Test đo độ trễ, jitter, tốc độ tải xuống và tải lên trực tiếp tới các endpoint cùng nguồn `/api/speedtest/ping`, `/api/speedtest/download` và `/api/speedtest/upload`. Mỗi gói tin bị giới hạn tối đa `<= 4 MiB` (`4.194.304` byte), tạo tức thời và hủy ngay sau khi đo, hoàn toàn không lưu lại trên máy chủ.',
      },
      {
        question: 'Đổi ngôn ngữ hiển thị có làm mất dữ liệu đang nhập trong công cụ không?',
        answer:
          'Không. Trước khi chuyển sang đường dẫn ngôn ngữ mới (`en`, `vi`, `ja`, `zh`), ToolWorkspace tự động lưu bản nháp tạm vào `sessionStorage` (`omnidev:draft:<toolId>`) và khôi phục lại ngay sau khi chuyển trang hoàn tất.',
      },
    ],
  },
  privacy: {
    navLabel: 'Quyền riêng tư',
    title: 'Chính sách Quyền riêng tư',
    metaTitle: 'Chính sách Quyền riêng tư — Lưu trữ Cục bộ, Cookie & Supabase | OmniDev IT-Tools',
    metaDescription:
      'Chính sách minh bạch của OmniDev IT-Tools: không theo dõi bên thứ ba, danh sách khóa localStorage & sessionStorage, cookie thiết yếu omnidev_locale và đồng bộ Supabase tùy chọn.',
    subtitle:
      'Minh bạch hoàn toàn về những gì chỉ nằm trong bộ nhớ trình duyệt, những gì lưu cục bộ/theo phiên và những gì chỉ đồng bộ khi bạn chọn.',
    keywords: [
      'chính sách quyền riêng tư omnidev',
      'bảo mật phía client',
      'khóa localstorage',
      'cookie omnidev_locale',
      'công cụ không theo dõi',
    ],
    sections: [
      {
        heading: 'Không Theo dõi Dữ liệu & Thực thi Phía Client',
        body: 'OmniDev không nhúng trình theo dõi quảng cáo bên thứ ba, mã phân tích hành vi hay beacon thu thập dữ liệu. Dữ liệu bạn dán vào công cụ (JWT, mã băm, regex, ảnh, tệp JSON/YAML/CSV, luồng micro) đều nằm lại trong môi trường trình duyệt cục bộ.',
      },
      {
        heading: 'Bộ nhớ Trình duyệt (`localStorage` & `sessionStorage`)',
        body: 'Để duy trì không gian làm việc liên tục mà không bắt buộc tạo tài khoản, OmniDev chỉ lưu tùy chọn và bản nháp trong bộ nhớ trình duyệt:',
        bullets: [
          '`localStorage`: `omnidev_client_id`, `omnidev_theme`, `omnidev_locale`, `omnidev_favorites`, `omnidev_pinned_snippets`, `omnidev_presets`, `omnidev_metrics`, `omnidev_speedtest_history`, `omnidev_tool_ratings`, `omnidev_feedback_submissions`, `omnidev_feedback_last_submit_at`, và `omnidev_admin_supabase_auth` (chỉ cho bảng quản trị).',
          '`sessionStorage`: Bản nháp tạm `omnidev:draft:<toolId>` được tạo ngay trước khi chuyển ngôn ngữ để giữ nguyên nội dung đang thao tác.',
        ],
      },
      {
        heading: 'Cookie Thiết yếu Duy nhất (`omnidev_locale`)',
        body: 'OmniDev chỉ đặt một cookie bên thứ nhất thiết yếu (`omnidev_locale`, `SameSite=Lax`, thời hạn 1 năm) để ghi nhớ ngôn ngữ hiển thị (`en`, `vi`, `ja`, `zh`) khi SSR/proxy điều hướng. Tuyệt đối không dùng cookie quảng cáo hay theo dõi liên trang.',
      },
      {
        heading: 'Đồng bộ Supabase Tùy chọn, Góp ý & Speed Test',
        body: 'Khi máy chủ triển khai có cấu hình biến môi trường Supabase, OmniDev đồng bộ các bản ghi ẩn danh (`user_favorites`, `saved_presets`, `tool_metrics`, `tool_ratings`, `feedback_submissions`) gắn với mã `omnidev_client_id` ngẫu nhiên của bạn.',
        bullets: [
          'Hộp thoại Góp ý: Email liên hệ và ngữ cảnh lỗi hoàn toàn là tùy chọn (opt-in); ngữ cảnh lỗi tự động loại bỏ chuỗi `?state=` và `#hash` để payload nhạy cảm không bao giờ bị gửi đi.',
          'Speed Test (`/api/speedtest/*`): Kiểm tra header cùng nguồn và truyền/hủy bộ đệm tạm `<= 4 MiB` trong RAM mà không ghi nhật ký hay lưu trữ nội dung.',
        ],
      },
    ],
  },
  terms: {
    navLabel: 'Điều khoản Sử dụng',
    title: 'Điều khoản Sử dụng',
    metaTitle: 'Điều khoản Sử dụng — Tiện ích Mã nguồn mở & Miễn trừ Trách nhiệm | OmniDev IT-Tools',
    metaDescription:
      'Điều khoản sử dụng OmniDev IT-Tools về phạm vi dùng hợp lệ, miễn trừ trách nhiệm tính toán phía client, an toàn thiết bị âm thanh và giới hạn Speed Test.',
    subtitle:
      'Các điều khoản ngắn gọn, rõ ràng cho việc sử dụng bộ tiện ích trình duyệt, công cụ chẩn đoán và endpoint tự lưu trữ của OmniDev.',
    keywords: [
      'điều khoản sử dụng omnidev',
      'miễn trừ trách nhiệm it tools',
      'giấy phép mã nguồn mở',
      'giới hạn speed test',
    ],
    sections: [
      {
        heading: '1. Giấy phép & Phạm vi Sử dụng Hợp lệ',
        body: 'OmniDev IT-Tools được cung cấp miễn phí dưới dạng bộ tiện ích lập trình mã nguồn mở cho mục đích cá nhân, học tập và kỹ thuật thương mại. Bạn có thể xem, tự lưu trữ và tùy biến mã nguồn theo giấy phép của kho lưu trữ.',
      },
      {
        heading: '2. Độ chính xác & Nguyên trạng ("As-Is")',
        body: 'Mọi công cụ và phép tính được cung cấp theo nguyên trạng ("AS IS") không kèm bảo đảm dưới bất kỳ hình thức nào. Hãy luôn đối chiếu độc lập các mã băm mật mã, phân quyền tệp (`chmod`), lịch Cron, độ tương phản màu và token bảo mật trước khi đưa lên môi trường sản xuất.',
      },
      {
        heading: '3. An toàn Thiết bị Âm thanh & Quyền truy cập',
        body: 'Công cụ Kiểm tra Loa tích hợp sẵn mức giới hạn âm lượng mặc định `35%` để bảo vệ thính giác, nhưng bạn vẫn có trách nhiệm kiểm tra mức âm lượng trên ampli ngoài, loa kiểm âm và tai nghe trước khi tăng âm lượng hoặc phát quét tần số cao.',
      },
      {
        heading: '4. Sử dụng Hợp lý API Speed Test Cùng nguồn',
        body: 'Các route `/api/speedtest/ping`, `/api/speedtest/download` và `/api/speedtest/upload` chỉ phục vụ phiên trình duyệt cùng nguồn với giới hạn `<= 4 MiB` mỗi lượt đo. Nghiêm cấm tự động hóa thu thập dữ liệu, nhúng trái phép từ domain khác hoặc cố tình gây quá tải băng thông.',
      },
    ],
  },
  contact: {
    navLabel: 'Liên hệ',
    title: 'Liên hệ & Hỗ trợ Cộng đồng',
    metaTitle: 'Liên hệ & Báo lỗi — Hộp thoại Góp ý, GitHub & Hỗ trợ | OmniDev IT-Tools',
    metaDescription:
      'Liên hệ đội ngũ duy trì OmniDev IT-Tools: gửi báo lỗi hoặc đề xuất tính năng qua Hộp thoại Góp ý tích hợp, mở GitHub Issue hoặc gửi email hỗ trợ.',
    subtitle:
      'Phát hiện lỗi biên, lỗi dịch thuật hoặc có ý tưởng cho công cụ thứ #29? Hãy liên hệ với chúng tôi qua kênh phù hợp nhất.',
    keywords: [
      'liên hệ omnidev',
      'báo lỗi it tools',
      'đề xuất tính năng omnidev',
      'github issues',
    ],
    sections: [
      {
        heading: 'Cách nhanh nhất để Báo lỗi',
        body: 'Hãy dùng Hộp thoại Góp ý tích hợp ngay trong ứng dụng để gắn đúng mã công cụ và tùy chọn đính kèm ngữ cảnh chẩn đoán đã làm sạch (ngôn ngữ, giao diện, kích thước màn hình và đường dẫn sạch không chứa `?state=`).',
        bullets: [
          'Theo dõi phản hồi và trạng thái xử lý (`Mới mở`, `Đang xử lý`, `Đã giải quyết`, `Đã đóng`) ngay trong thẻ "Góp ý của tôi".',
          'Với đóng góp mã nguồn mở, Pull Request hoặc ca kiểm thử tái hiện lỗi, vui lòng mở issue trên kho GitHub.',
        ],
      },
    ],
    channelsHeading: 'Các Kênh Hỗ trợ & Đóng góp',
    feedbackCardTitle: 'Hộp thoại Góp ý & Theo dõi Lỗi',
    feedbackCardDesc:
      'Gửi báo lỗi, đề xuất tính năng hoặc góp ý chung ngay tại đây và theo dõi phản hồi từ quản trị viên.',
    githubCardTitle: 'Kho Mã nguồn & Issues GitHub',
    githubCardDesc:
      'Xem mã nguồn, tài liệu AI-DLC hoặc tạo báo lỗi có thể tái hiện và Pull Request.',
    emailCardTitle: 'Email Hỗ trợ Trực tiếp',
    emailCardDesc:
      'Liên hệ trực tiếp người vận hành qua email khi bản triển khai này có cấu hình địa chỉ hỗ trợ.',
  },
};
