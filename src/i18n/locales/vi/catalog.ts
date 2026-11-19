import type { CatalogDictionary } from '../../types';

export const viCatalog: CatalogDictionary = {
  categories: {
    image: {
      name: 'Xử lý Ảnh',
      tagline: 'Chuyển đổi Canvas, nén ảnh, Data URL & tối ưu SVG',
      description:
        'Chuyển đổi định dạng, nén tài nguyên, mã hóa Base64 Data URL và rút gọn vector SVG trực tiếp trong bộ nhớ trình duyệt với độ trễ tải lên bằng 0.',
      seoTitle: 'Công cụ Ảnh Trình duyệt — Chuyển đổi, Nén, Base64 & SVG',
      seoDescription:
        'Công cụ chuyển đổi, nén ảnh, mã hóa Base64 và tối ưu SVG ưu tiên riêng tư, chạy 100% cục bộ qua HTML5 Canvas.',
    },
    file: {
      name: 'Xử lý Tệp',
      tagline: 'Chuyển đổi JSON/YAML/CSV, mã băm SHA, Magic Bytes & So sánh Diff',
      description:
        'Chuyển đổi dữ liệu có cấu trúc, kiểm tra mã băm SHA-1/256/384/512 qua Web Crypto, soi magic bytes nhị phân và so sánh diff trực quan.',
      seoTitle: 'Công cụ Tệp Lập trình — JSON/YAML/CSV, SHA-256, Magic Bytes & Diff',
      seoDescription:
        'Chuyển đổi JSON, YAML và CSV, tính mã băm Web Crypto, kiểm tra MIME magic bytes và so sánh diff văn bản ngay tại trình duyệt.',
    },
    text: {
      name: 'Xử lý Văn bản',
      tagline: 'Đổi kiểu chữ, kiểm thử Regex, giải mã JWT, tạo ID & mã hóa',
      description:
        'Chuyển đổi quy ước đặt tên, gỡ lỗi biểu thức chính quy với nhóm bắt giữ, giải mã claim JWT, tạo UUID/ULID/NanoID và mã hóa chuỗi.',
      seoTitle: 'Công cụ Văn bản Lập trình — Case, Regex, JWT Decoder, UUID & Base64',
      seoDescription:
        'Tiện ích văn bản phía client: đổi kiểu đặt tên biến, kiểm thử regex trực tiếp, soi payload JWT, tạo UUID/ULID và mã hóa Base64/URL/HTML.',
    },
    color: {
      name: 'Xử lý Màu sắc',
      tagline: 'HEX/RGB/HSL/OKLCH, tương phản WCAG, thang sắc độ & kính CSS',
      description:
        'Chuyển đổi không gian màu cảm nhận gồm OKLCH, kiểm tra tỷ lệ tương phản WCAG 2.1 AA/AAA, tạo thang màu 50–950 và tinh chỉnh glassmorphism CSS.',
      seoTitle: 'Công cụ Màu UI & CSS — Chuyển đổi OKLCH, Tương phản WCAG & Glassmorphism',
      seoDescription:
        'Chuyển đổi màu HEX, RGB, HSL và OKLCH, kiểm tra độ tương phản WCAG, dựng bảng màu 50–950 và tạo CSS glassmorphism cho thẻ Bento.',
    },
    calculators: {
      name: 'Máy tính Hệ thống',
      tagline: 'Ma trận Chmod, lịch Cron, dấu thời gian Unix, byte & hệ cơ số',
      description:
        'Tính quyền bát phân Unix chmod, phân tích lịch cron 5 trường, chuyển đổi dấu thời gian epoch đa múi giờ và tính đơn vị byte IEC/SI cùng hệ cơ số.',
      seoTitle: 'Máy tính Lập trình — Chmod, Phân tích Cron, Epoch & Đổi Byte',
      seoDescription:
        'Ma trận quyền chmod tương tác, giải thích biểu thức cron kèm 5 lần chạy kế tiếp, chuyển đổi Unix timestamp và tính byte IEC/SI & hệ cơ số.',
    },
    cheatsheets: {
      name: 'Sổ tay Lệnh',
      tagline: 'Thẻ tra cứu nhanh Git, mã trạng thái HTTP, Regex, Linux & Docker',
      description:
        'Bảng tra cứu Bento có bộ lọc nhanh và sao chép một chạm cho Git/GitHub CLI, mã trạng thái & header HTTP và mẫu lệnh DevOps/Docker/Regex.',
      seoTitle: 'Sổ tay Lập trình — Git CLI, Mã trạng thái HTTP, Linux & Docker',
      seoDescription:
        'Sổ tay tra cứu tức thì cho lập trình viên với tính năng lọc nhanh, sao chép một chạm và ghim lệnh Git, HTTP, Linux, Docker và Regex.',
    },
    diagnostics: {
      name: 'Thiết bị & Mạng',
      tagline: 'Kiểm tra bàn phím NKRO, Micro VU/FFT, Loa Stereo & Tốc độ mạng',
      description:
        'Kiểm tra độ nhận đa phím NKRO và lỗi lặp phím, theo dõi mức âm lượng micro cục bộ, kiểm tra kênh loa Trái/Phải và đo ping, jitter, tốc độ tải xuống/tải lên.',
      seoTitle: 'Chẩn đoán Thiết bị & Mạng — Bàn phím, Micro, Loa & Speed Test',
      seoDescription:
        'Công cụ chẩn đoán phần cứng gốc trên trình duyệt và đo tốc độ mạng tự lưu trữ: kiểm tra bàn phím ANSI NKRO, phân tích sóng âm/dBFS micro, kiểm tra loa trái/phải và đo băng thông.',
    },
  },
  tools: {
    'image-converter': {
      name: 'Chuyển đổi Định dạng Ảnh',
      shortDescription: 'Chuyển đổi ảnh PNG, JPEG và WebP ngoại tuyến qua HTML5 Canvas.',
      longDescription:
        'Kéo thả hoặc chọn ảnh bitmap và chuyển đổi mượt mà giữa PNG, JPEG và WebP với chất lượng tùy chỉnh cùng so sánh dung lượng tức thì.',
      keywords: ['png', 'jpg', 'jpeg', 'webp', 'chuyển đổi', 'canvas', 'định dạng ảnh'],
      howItWorks: [
        'Đọc ảnh bạn chọn cục bộ qua FileReader / Object URL mà không chạm tới bất kỳ máy chủ nào.',
        'Vẽ bitmap đã giải mã lên phần tử HTML5 Canvas ẩn ở độ phân giải đầy đủ.',
        'Xuất bộ đệm canvas sang định dạng PNG, JPEG hoặc WebP với chất lượng nén tùy chọn.',
      ],
      faqs: [
        {
          question: 'Ảnh của tôi có bị tải lên máy chủ đám mây để chuyển đổi không?',
          answer:
            'Không. Quá trình giải mã và mã hóa diễn ra hoàn toàn trong trình duyệt bằng API HTML5 Canvas.',
        },
        {
          question: 'Định dạng đầu ra nào hỗ trợ nền trong suốt?',
          answer:
            'PNG và WebP giữ nguyên kênh alpha trong suốt; JPEG tô vùng trong suốt bằng nền đặc.',
        },
      ],
    },
    'image-compressor': {
      name: 'Nén & Thay đổi Kích thước Ảnh',
      shortDescription: 'Thu phóng kích thước và giảm dung lượng tệp với xem trước chênh lệch byte.',
      longDescription:
        'Thay đổi kích thước ảnh có khóa tỷ lệ khung hình, tinh chỉnh mức nén mất dữ liệu và kiểm tra chính xác phần trăm dung lượng tiết kiệm trước khi tải xuống.',
      keywords: ['nén ảnh', 'resize', 'tối ưu ảnh', 'giảm dung lượng', 'tỷ lệ khung hình', 'webp', 'jpeg'],
      howItWorks: [
        'Phân tích kích thước pixel gốc và tính toán chiều rộng/cao mục tiêu theo đúng tỷ lệ.',
        'Lấy mẫu lại hình ảnh mượt mà bằng nội suy chất lượng cao của Canvas 2D.',
        'So sánh số byte gốc với Blob sau nén để báo cáo chính xác tỷ lệ phần trăm giảm dung lượng.',
      ],
      faqs: [
        {
          question: 'Tính năng khóa tỷ lệ khung hình hoạt động ra sao?',
          answer:
            'Khi bật khóa, việc chỉnh sửa chiều rộng hoặc chiều cao sẽ tự động tính lại chiều còn lại tương ứng.',
        },
        {
          question: 'Mức chất lượng nào tối ưu nhất cho tài nguyên web?',
          answer:
            'WebP hoặc JPEG ở mức chất lượng 0.78–0.85 thường giảm 60–80% dung lượng mà ít suy giảm thị giác.',
        },
      ],
    },
    'image-base64': {
      name: 'Ảnh sang Base64 / Data URL',
      shortDescription: 'Mã hóa ảnh thành chuỗi Base64, CSS url() hoặc thẻ HTML <img>.',
      longDescription:
        'Chuyển mọi tệp hình ảnh thành Data URL sẵn sàng dán, chuỗi Base64 thuần, đoạn CSS background hoặc thẻ HTML img nhúng trực tiếp.',
      keywords: ['base64', 'data url', 'data uri', 'nhúng ảnh', 'css url'],
      howItWorks: [
        'Đọc byte nhị phân của ảnh qua FileReader.readAsDataURL hoàn toàn trong trình duyệt.',
        'Trích xuất kiểu MIME, dung lượng byte và chuỗi Base64 để sao chép ngay lập tức.',
        'Tạo sẵn đoạn mã Data URL, CSS background-image và thẻ HTML <img>.',
      ],
      faqs: [
        {
          question: 'Khi nào nên nhúng ảnh dạng Base64?',
          answer:
            'Các biểu tượng nhỏ, favicon hoặc mẫu email dưới ~10 KB sẽ hưởng lợi nhờ giảm số lượng yêu cầu HTTP.',
        },
        {
          question: 'Base64 có làm tăng kích thước dữ liệu không?',
          answer:
            'Có, mã hóa Base64 làm tăng khoảng 33% dung lượng so với tệp nhị phân gốc.',
        },
      ],
    },
    'svg-optimizer': {
      name: 'Tối ưu & Xem trước SVG',
      shortDescription: 'Rút gọn mã SVG nội tuyến, xóa metadata và xem trước sắc nét.',
      longDescription:
        'Dán hoặc tải lên tệp SVG để loại bỏ chú thích XML, khoảng trắng dư thừa và metadata của trình chỉnh sửa trong khi xem trước vector trực tiếp.',
      keywords: ['svg', 'rút gọn', 'tối ưu', 'vector', 'làm sạch', 'xem trước'],
      howItWorks: [
        'Loại bỏ khai báo XML, chú thích, namespace của phần mềm thiết kế và khoảng trắng thừa.',
        'Tính toán chính xác lượng byte giảm giữa mã SVG gốc và mã đã rút gọn.',
        'Hiển thị vùng xem trước nền caro trực tiếp cùng mã HTML/JSX sẵn sàng sao chép.',
      ],
      faqs: [
        {
          question: 'Tối ưu SVG có làm mất chi tiết đồ họa không?',
          answer:
            'Không, việc xóa chú thích, metadata và khoảng trắng thừa giữ nguyên toàn bộ đường nét vector.',
        },
        {
          question: 'Tôi có thể xem trước SVG nền trong suốt không?',
          answer:
            'Có, khung xem trước hiển thị nền ô caro tinh tế phía sau đồ họa vector của bạn.',
        },
      ],
    },
    'data-converter': {
      name: 'Chuyển đổi JSON ↔ YAML ↔ CSV',
      shortDescription: 'Chuyển đổi hai chiều và định dạng giữa JSON, YAML và CSV.',
      longDescription:
        'Chuyển đổi tệp cấu hình và dữ liệu dạng bảng mượt mà giữa JSON, YAML và CSV chuẩn RFC-4180 với định dạng dễ đọc.',
      keywords: ['json', 'yaml', 'yml', 'csv', 'chuyển đổi', 'định dạng', 'phân tích'],
      howItWorks: [
        'Phân tích văn bản nguồn JSON, YAML hoặc CSV thành đối tượng JavaScript trung gian.',
        'Kiểm tra cú pháp và báo lỗi dòng/ký tự chi tiết nếu dữ liệu không hợp lệ.',
        'Tuần tự hóa cấu trúc thành định dạng đích sạch sẽ với mức thụt lề chuẩn.',
      ],
      faqs: [
        {
          question: 'Đối tượng lồng nhau được xử lý thế nào khi xuất ra CSV?',
          answer:
            'Các giá trị lồng nhau trong mảng được tuần tự hóa an toàn thành chuỗi JSON gọn trong ô CSV có ngoặc kép.',
        },
        {
          question: 'Trình chuyển đổi YAML có hỗ trợ chuỗi nhiều dòng và boolean không?',
          answer: 'Có, công cụ dùng bộ phân tích và xuất tương thích đầy đủ YAML 1.2.',
        },
      ],
    },
    'file-hash': {
      name: 'Tính mã băm & Checksum Tệp',
      shortDescription: 'Tính SHA-1, SHA-256, SHA-384 và SHA-512 qua Web Crypto.',
      longDescription:
        'Xác minh tệp tải xuống hoặc băm chuỗi văn bản cục bộ bằng hàm băm Web Crypto tăng tốc phần cứng và đối chiếu với checksum kỳ vọng.',
      keywords: ['sha256', 'sha512', 'sha1', 'checksum', 'mã băm', 'toàn vẹn', 'web crypto'],
      howItWorks: [
        'Đọc tệp đã thả vào ArrayBuffer hoặc mã hóa văn bản thành mảng byte UTF-8.',
        'Gọi song song `crypto.subtle.digest` gốc cho SHA-1, SHA-256, SHA-384 và SHA-512.',
        'Đối chiếu chuỗi hex tính được với checksum kỳ vọng tùy chọn để xác thực ngay.',
      ],
      faqs: [
        {
          question: 'Băm bằng Web Crypto có nhanh với tệp lớn không?',
          answer:
            'Có, `crypto.subtle.digest` ủy quyền cho triển khai C++/SIMD gốc ngay trong trình duyệt.',
        },
        {
          question: 'Vì sao nên ưu tiên SHA-256 hơn SHA-1?',
          answer:
            'SHA-1 dễ bị tấn công đụng độ, trong khi SHA-256 và SHA-512 vẫn an toàn về mặt mật mã cho kiểm tra toàn vẹn.',
        },
      ],
    },
    'file-inspector': {
      name: 'Kiểm tra MIME Type & Magic Bytes',
      shortDescription: 'Nhận diện định dạng tệp thực tế từ header hex và chữ ký nhị phân.',
      longDescription:
        'Soi 32 byte đầu tiên của mọi tệp dưới dạng hex và ASCII để phát hiện đúng kiểu MIME bất kể phần mở rộng tệp bị đổi tên.',
      keywords: ['magic bytes', 'mime', 'chữ ký tệp', 'hex', 'nhị phân', 'kiểm tra'],
      howItWorks: [
        'Đọc các byte tiêu đề đầu tệp bằng `File.slice()` và `Uint8Array`.',
        'Khớp các chữ ký nhị phân phổ biến (PNG, JPEG, WebP, PDF, ZIP, GZIP, ELF, WASM, SQLite, MP3).',
        'Hiển thị header thập lục phân đã định dạng, bản xem trước ASCII và kiểu MIME phát hiện được.',
      ],
      faqs: [
        {
          question: 'Vì sao nên kiểm tra magic bytes thay vì phần mở rộng tệp?',
          answer:
            'Phần mở rộng tệp có thể bị đổi tên hoặc giả mạo, còn magic bytes xác định đúng định dạng nhị phân thực sự.',
        },
        {
          question: 'Nếu tệp không có chữ ký nhị phân thì sao?',
          answer:
            'Trình kiểm tra đánh giá khả năng in UTF-8 và heuristic để nhận diện SVG, JSON hoặc văn bản thuần.',
        },
      ],
    },
    'file-diff': {
      name: 'So sánh Diff Tệp Song song',
      shortDescription: 'So sánh hai khối văn bản hoặc tệp với tô sáng LCS từng dòng.',
      longDescription:
        'Dán cấu hình, đoạn mã hoặc log gốc và bản chỉnh sửa để xem rõ dòng thêm mới, dòng bị xóa cùng số dòng tương ứng.',
      keywords: ['diff', 'so sánh', 'hợp nhất', 'so sánh dòng', 'patch', 'so sánh văn bản'],
      howItWorks: [
        'Tách cả hai đầu vào thành các mảng dòng chuẩn hóa.',
        'Tính Chuỗi con chung dài nhất (LCS) để căn chỉnh các dòng ngữ cảnh không đổi.',
        'Tô sáng dòng bị xóa màu đỏ dịu và dòng thêm mới màu xanh ngọc lục bảo kèm hai cột số dòng.',
      ],
      faqs: [
        {
          question: 'Tôi có thể nạp tệp cục bộ trực tiếp vào trình xem diff không?',
          answer:
            'Có, bạn có thể dán văn bản vào khung Bản gốc hoặc Bản đã sửa.',
        },
        {
          question: 'Khác biệt về khoảng trắng có được giữ lại không?',
          answer:
            'Có, mọi sai khác ký tự trên từng dòng đều được đánh dấu để không bỏ sót chỉnh sửa cấu hình tinh vi.',
        },
      ],
    },
    'case-converter': {
      name: 'Chuyển đổi Kiểu chữ & Quy ước Đặt tên',
      shortDescription: 'Chuyển đổi qua lại camelCase, snake_case, kebab-case, PascalCase & hơn thế.',
      longDescription:
        'Biến đổi định danh và văn bản sang 12 quy ước đặt tên lập trình đồng thời, kèm bộ đếm ký tự, từ, dòng và byte UTF-8 trực tiếp.',
      keywords: [
        'camelcase',
        'snake_case',
        'kebab-case',
        'pascalcase',
        'constant_case',
        'chuyển đổi kiểu chữ',
      ],
      howItWorks: [
        'Tách từ qua ranh giới camelCase, dấu gạch dưới, gạch nối, dấu chấm và khoảng trắng.',
        'Tái tạo 12 định dạng chữ hoa/thường chuẩn lập trình và văn bản theo thời gian thực.',
        'Tính chính xác độ dài byte UTF-8 cùng số lượng ký tự, từ và dòng.',
      ],
      faqs: [
        {
          question: 'Công cụ có tách chuẩn đầu vào camelCase hoặc snake_case trộn lẫn không?',
          answer:
            'Có, bộ nhận diện ranh giới từ xử lý chính xác các chuỗi hỗn hợp như `apiResponse_v2URL`.',
        },
        {
          question: 'Số đếm byte UTF-8 có chính xác với emoji và tiếng Việt không?',
          answer: 'Có, kích thước byte được đo bằng API `TextEncoder` gốc.',
        },
      ],
    },
    'regex-tester': {
      name: 'Kiểm thử Regex & Soi Kết quả Khớp',
      shortDescription: 'Kiểm thử biểu thức chính quy JS với tô sáng khớp & nhóm bắt giữ.',
      longDescription:
        'Kiểm tra biểu thức chính quy với dữ liệu mẫu, bật/tắt cờ (`g`, `i`, `m`, `s`, `u`) và xem bảng các nhóm bắt giữ theo chỉ mục hoặc tên.',
      keywords: ['regex', 'regexp', 'biểu thức chính quy', 'nhóm bắt giữ', 'mẫu', 'khớp'],
      howItWorks: [
        'Biên dịch mẫu và tập cờ bên trong khối `new RegExp()` được bảo vệ.',
        'Lặp qua các kết quả khớp an toàn với cơ chế chặn vòng lặp vô hạn khi khớp rỗng.',
        'Liệt kê vị trí khớp và bảng nhóm bắt giữ đánh số hoặc đặt tên.',
      ],
      faqs: [
        {
          question: 'Trình kiểm thử này sử dụng engine regex nào?',
          answer:
            'Công cụ chạy trực tiếp trên engine JavaScript ECMAScript RegExp của trình duyệt, hỗ trợ lookbehind và nhóm có tên.',
        },
        {
          question: 'Các kết quả khớp độ dài 0 được xử lý thế nào?',
          answer:
            'Kết quả khớp rỗng tự tăng `lastIndex` an toàn và giới hạn số vòng lặp để không làm treo trình duyệt.',
        },
      ],
    },
    'jwt-decoder': {
      name: 'Giải mã JWT & Soi Header/Payload',
      shortDescription: 'Giải mã JSON Web Token cục bộ kèm kiểm tra trạng thái hết hạn tự động.',
      longDescription:
        'Kiểm tra header JOSE, các claim trong payload, mốc thời gian `iat`/`exp`/`nbf` và phần chữ ký JWT mà không bao giờ gửi token qua mạng.',
      keywords: ['jwt', 'json web token', 'giải mã', 'claims', 'bearer', 'exp', 'xác thực'],
      howItWorks: [
        'Tách chuỗi JWS nén thành 3 phần header, payload và chữ ký.',
        'Giải mã các phần Base64URL UTF-8 thành cây JSON định dạng rõ ràng.',
        'Đối chiếu các claim `exp` và `nbf` với đồng hồ cục bộ để hiển thị nhãn hiệu lực.',
      ],
      faqs: [
        {
          question: 'Dán JWT môi trường production vào đây có an toàn không?',
          answer:
            'Có. Quá trình giải mã diễn ra 100% cục bộ trong bộ nhớ; không có token nào rời khỏi tab trình duyệt.',
        },
        {
          question: 'Giải mã có xác minh chữ ký mật mã không?',
          answer:
            'Giải mã giúp xem header và payload; việc xác minh chữ ký cần khóa bí mật phía máy chủ hoặc JWKS công khai.',
        },
      ],
    },
    'id-generator': {
      name: 'Trình tạo UUID / ULID / NanoID & Token',
      shortDescription: 'Tạo UUID v4, ULID, NanoID và token ngẫu nhiên an toàn mật mã.',
      longDescription:
        'Tạo đơn lẻ hoặc hàng loạt định danh chống trùng lặp và chuỗi bí mật API sử dụng `crypto.getRandomValues`.',
      keywords: ['uuid', 'ulid', 'nanoid', 'token', 'mật khẩu', 'ngẫu nhiên', 'csprng'],
      howItWorks: [
        'Lấy entropy từ bộ sinh số ngẫu nhiên an toàn của trình duyệt (`crypto.randomUUID` / `crypto.getRandomValues`).',
        'Định dạng UUID v4 chuẩn RFC 4122, ULID Crockford Base32 có dấu thời gian hoặc NanoID tùy chỉnh độ dài.',
        'Hỗ trợ tạo hàng loạt tới 30 mã một lúc và sao chép một chạm.',
      ],
      faqs: [
        {
          question: 'ULID có ưu điểm gì so với UUID v4?',
          answer:
            'ULID nhúng tiền tố dấu thời gian 48-bit theo mili-giây nên có thể sắp xếp theo thứ tự từ điển trong chỉ mục cơ sở dữ liệu.',
        },
        {
          question: 'Token tạo ra có an toàn về mặt mật mã không?',
          answer:
            'Có, toàn bộ tính ngẫu nhiên lấy từ Web Crypto `getRandomValues`, tuyệt đối không dùng `Math.random()`.',
        },
      ],
    },
    'text-encoder': {
      name: 'Mã hóa & Giải mã Base64 / URL / HTML',
      shortDescription: 'Mã hóa và giải mã Base64 UTF-8, thành phần URL và thực thể HTML.',
      longDescription:
        'Chuyển đổi hai chiều chuỗi văn bản bằng Base64 an toàn UTF-8, `encodeURIComponent` và escape thực thể HTML trong một giao diện thống nhất.',
      keywords: ['base64', 'mã hóa url', 'giải mã', 'html entities', 'escape', 'utf-8'],
      howItWorks: [
        'Chuyển chuỗi Unicode thành mảng byte UTF-8 trước khi mã hóa Base64 để emoji hay tiếng Việt không làm lỗi `btoa()`.',
        'Áp dụng mã hóa phần trăm chuẩn RFC 3986 cho chuỗi truy vấn và tham số URL.',
        'Escape an toàn các ký tự `<`, `>`, `&`, `"` và `\'` cho ngữ cảnh HTML.',
      ],
      faqs: [
        {
          question: 'Vì sao `btoa()` mặc định bị lỗi với văn bản Unicode?',
          answer:
            '`btoa` gốc chỉ nhận byte Latin-1; công cụ này mã hóa qua `TextEncoder` trước để hỗ trợ đầy đủ UTF-8.',
        },
        {
          question: 'Khác nhau giữa `encodeURI` và `encodeURIComponent` là gì?',
          answer:
            '`encodeURIComponent` mã hóa cả ký tự phân tách như `&`, `=` và `/`, lý tưởng cho giá trị tham số query.',
        },
      ],
    },
    'color-converter': {
      name: 'Chuyển đổi Màu HEX / RGB / HSL / OKLCH',
      shortDescription: 'Chuyển đổi màu giữa HEX, RGB, HSL và không gian cảm nhận OKLCH.',
      longDescription:
        'Chọn hoặc dán mã màu bất kỳ để kiểm tra biểu diễn CSS chính xác qua các không gian màu HEX, sRGB, HSL và OKLCH dải rộng.',
      keywords: ['hex', 'rgb', 'hsl', 'oklch', 'chuyển đổi màu', 'màu css'],
      howItWorks: [
        'Phân tích mã HEX 3 hoặc 6 ký tự thành các kênh sRGB chuẩn hóa.',
        'Biến đổi sRGB sang tọa độ trụ HSL và tọa độ cảm nhận OKLab/OKLCH.',
        'Xuất khai báo CSS Level 4 sẵn sàng sao chép cho hệ thống thiết kế hiện đại.',
      ],
      faqs: [
        {
          question: 'Vì sao nên dùng OKLCH thay cho HSL trong CSS hiện đại?',
          answer:
            'OKLCH đồng nhất về mặt cảm nhận, nghĩa là các màu có cùng độ sáng sẽ trông sáng ngang nhau với mắt người.',
        },
        {
          question: 'Các trình duyệt hiện đại có hỗ trợ `oklch()` chưa?',
          answer: 'Có, Chrome, Safari, Firefox và Edge đều hỗ trợ CSS `oklch()` nguyên bản.',
        },
      ],
    },
    'contrast-checker': {
      name: 'Kiểm tra Tỷ lệ Tương phản WCAG',
      shortDescription: 'Kiểm thử cặp màu chữ/nền theo chuẩn WCAG 2.1 AA và AAA.',
      longDescription:
        'Xác minh độ dễ đọc của văn bản bằng tỷ lệ độ chói tương đối chính xác, bản xem trước thẻ UI trực tiếp và huy hiệu đạt/trượt AA/AAA tức thì.',
      keywords: ['wcag', 'tương phản', 'khả năng tiếp cận', 'a11y', 'aa', 'aaa', 'độ chói'],
      howItWorks: [
        'Tuyến tính hóa kênh sRGB và tính độ chói tương đối chuẩn WCAG 2.1 cho cả hai màu.',
        'Tính chính xác tỷ lệ tương phản `(L1 + 0.05) / (L2 + 0.05)`.',
        'Đánh giá ngưỡng cho Chữ thường (4.5:1 AA / 7:1 AAA) và Chữ lớn (3:1 AA / 4.5:1 AAA).',
      ],
      faqs: [
        {
          question: 'Thế nào được coi là Chữ lớn trong WCAG 2.1?',
          answer: 'Văn bản có kích thước tối thiểu 18pt (24px) thường hoặc 14pt (18.67px) in đậm.',
        },
        {
          question: 'Tỷ lệ tương phản tối thiểu cho văn bản nội dung là bao nhiêu?',
          answer: 'Chuẩn WCAG AA yêu cầu tối thiểu 4.5:1 cho văn bản thân bài bình thường.',
        },
      ],
    },
    'palette-generator': {
      name: 'Tạo Bảng màu Đơn sắc & Thang sắc độ',
      shortDescription: 'Tạo dải sắc độ cân bằng 50–950 kèm biến CSS & JSON.',
      longDescription:
        'Nhập bất kỳ màu gốc nào để tổng hợp thang 11 bậc (50 đến 950) cho hệ thống thiết kế, tự động gợi ý màu chữ tương phản cao.',
      keywords: ['bảng màu', 'thang sắc độ', 'design tokens', 'biến css', 'shades', '50-950'],
      howItWorks: [
        'Trích xuất sắc độ và độ bão hòa gốc từ màu bạn chọn.',
        'Nội suy 11 mức độ sáng cân đối từ 97% (50) xuống 9% (950).',
        'Xuất biến tùy chỉnh CSS (`--color-50`..`--color-950`) hoặc token JSON sạch sẽ.',
      ],
      faqs: [
        {
          question: 'Công cụ chọn chữ tối hay sáng trên từng ô màu bằng cách nào?',
          answer:
            'Mỗi bậc tự tính độ chói tương đối và chọn nhãn `#09090B` hoặc `#FAFAFA` tương phản cao.',
        },
        {
          question: 'Tôi có thể dán kết quả trực tiếp vào `globals.css` không?',
          answer: 'Có, nút sao chép biến CSS xuất sẵn khai báo `:root` hợp lệ.',
        },
      ],
    },
    'glass-generator': {
      name: 'Tạo CSS Glassmorphism & Thẻ Bento',
      shortDescription: 'Tinh chỉnh độ mờ, trong suốt, bão hòa & viền phản chiếu CSS trực quan.',
      longDescription:
        'Thiết kế bề mặt kính mờ đơn sắc trực quan, xem trước trên nền tối hoặc sáng và sao chép mã CSS sẵn sàng cho sản phẩm.',
      keywords: [
        'glassmorphism',
        'backdrop-filter',
        'blur',
        'bento',
        'tạo css',
        'kính mờ',
      ],
      howItWorks: [
        'Điều chỉnh độ mờ nền, bán kính làm mờ `backdrop-filter`, độ bão hòa và độ trong suốt viền `1px`.',
        'Xem trước thẻ kính theo thời gian thực trên nền hình học tương phản cao.',
        'Xuất mã CSS sạch kèm tiền tố trình duyệt sẵn sàng cho các thẻ Bento.',
      ],
      faqs: [
        {
          question: 'Vì sao nên kết hợp `blur()` với `saturate()` trong `backdrop-filter`?',
          answer:
            'Tăng nhẹ độ bão hòa giúp bề mặt kính mờ không bị xỉn màu trên nền trung tính.',
        },
        {
          question: 'Glassmorphism có hiệu quả ở Chế độ Sáng không?',
          answer:
            'Có, sử dụng nền trắng bán trong suốt kết hợp viền mảnh tối tạo chiều sâu xúc giác trên nền sáng.',
        },
      ],
    },
    'chmod-calculator': {
      name: 'Máy tính Quyền Chmod',
      shortDescription: 'Ma trận quyền rwx Unix tương tác cho chế độ bát phân và ký hiệu.',
      longDescription:
        'Bật/tắt các bit đọc/ghi/thực thi cho Owner, Group và Others hoặc nhập mã bát phân như `0755` để tạo lệnh `chmod` chính xác.',
      keywords: ['chmod', 'unix', 'quyền truy cập', 'bát phân', 'rwx', 'linux', '755', '644'],
      howItWorks: [
        'Ánh xạ các cờ Đọc (4), Ghi (2) và Thực thi (1) cho Chủ sở hữu, Nhóm và Người khác.',
        'Đồng bộ hai chiều ô chọn với chuỗi bát phân 3 chữ số (`755`) và ký hiệu (`rwxr-xr-x`).',
        'Cung cấp mẫu nhanh cho tệp thường (`644`), tệp thực thi (`755`) và khóa riêng tư (`600`).',
      ],
      faqs: [
        {
          question: 'Khóa riêng tư SSH nên đặt quyền nào?',
          answer:
            'Khóa riêng tư thường yêu cầu `600` (`-rw-------`) để chỉ chủ sở hữu mới có quyền đọc hoặc ghi.',
        },
        {
          question: 'Sự khác biệt giữa `644` và `755` là gì?',
          answer:
            '`755` cấp thêm quyền thực thi (`x`), bắt buộc đối với tập lệnh và việc duyệt thư mục.',
        },
      ],
    },
    'cron-calculator': {
      name: 'Phân tích & Tạo Biểu thức Cron',
      shortDescription: 'Dịch lịch cron 5 trường sang ngôn ngữ tự nhiên và 5 lần chạy kế tiếp.',
      longDescription:
        'Kiểm tra hợp lệ biểu thức cron Unix chuẩn, chọn mẫu nhanh, đọc mô tả dễ hiểu và xem các mốc chạy UTC tiếp theo.',
      keywords: ['cron', 'crontab', 'lịch trình', 'scheduler', 'lần chạy kế tiếp', 'devops'],
      howItWorks: [
        'Phân tích 5 trường cách nhau bởi dấu cách (`phút giờ ngày tháng thứ`) gồm bước nhảy (`*/5`), khoảng (`1-5`) và danh sách.',
        'Tạo câu tóm tắt nhịp chạy rõ ràng bằng ngôn ngữ tự nhiên.',
        'Mô phỏng các phút tiếp theo để liệt kê 5 mốc thời gian thực thi ISO-8601 chính xác.',
      ],
      faqs: [
        {
          question: '`*/15 * * * *` nghĩa là gì?',
          answer: 'Lệnh chạy mỗi 15 phút (vào phút :00, :15, :30 và :45 của mỗi giờ).',
        },
        {
          question: 'Giá trị thứ trong tuần có đánh số từ 0 không?',
          answer: 'Có, `0` là Chủ nhật đến `6` là Thứ bảy.',
        },
      ],
    },
    'timestamp-converter': {
      name: 'Chuyển đổi Unix Timestamp & Ngày ISO',
      shortDescription: 'Chuyển đổi dấu thời gian Unix (giây/ms) và ngày ISO-8601 đa múi giờ.',
      longDescription:
        'Tự động nhận diện giây hay mili-giây, xem giờ UTC, chênh lệch tương đối và hiển thị định dạng theo nhiều múi giờ.',
      keywords: ['unix timestamp', 'epoch', 'iso 8601', 'ngày giờ', 'múi giờ', 'utc'],
      howItWorks: [
        'Tự động phân biệt epoch Unix 10 chữ số (giây) với 13 chữ số (mili-giây).',
        'Phân tích chuỗi ISO-8601, RFC-2822 và ngày tự nhiên bằng `Date` và `Intl.DateTimeFormat` của trình duyệt.',
        'Hiển thị đồng hồ epoch cùng đầu ra UTC, America/New_York, Europe/London, Asia/Tokyo và Asia/Ho_Chi_Minh.',
      ],
      faqs: [
        {
          question: 'Tính năng tự nhận diện phân biệt giây và mili-giây thế nào?',
          answer:
            'Giá trị số nhỏ hơn `1e11` được hiểu là giây; giá trị lớn hơn được hiểu là mili-giây.',
        },
        {
          question: 'Sự cố Năm 2038 là gì?',
          answer:
            'Số nguyên Unix giây 32-bit có dấu sẽ tràn vào 19/01/2038; hệ thống 64-bit và số JS hiện đại tránh được giới hạn này.',
        },
      ],
    },
    'unit-base-calculator': {
      name: 'Máy tính Byte / Băng thông / Hệ cơ số',
      shortDescription: 'Chuyển đổi đơn vị lưu trữ SI/IEC và số nguyên Bin/Oct/Dec/Hex.',
      longDescription:
        'Tính kích thước byte thập phân (KB/MB/GB) so với nhị phân (KiB/MiB/GiB), ước tính thời gian truyền tải và đổi hệ cơ số cho số nguyên lớn.',
      keywords: ['bytes', 'kib', 'mib', 'gib', 'nhị phân', 'hex', 'bát phân', 'thập phân', 'cơ số'],
      howItWorks: [
        'Tính đồng thời cả đơn vị SI cơ số 10 (`1000^n`) và đơn vị IEC cơ số 2 (`1024^n`).',
        'Sử dụng `BigInt` của JavaScript để đổi Nhị phân, Bát phân, Thập phân và Thập lục phân không mất độ chính xác.',
        'Ước tính thời gian truyền tải mạng theo tốc độ đường truyền Mbps.',
      ],
      faqs: [
        {
          question: 'Vì sao ổ cứng 1 TB chỉ hiển thị ~931 GiB trong hệ điều hành?',
          answer:
            'Nhà sản xuất ghi dung lượng theo Terabyte thập phân (`10^12` byte), còn hệ điều hành thường hiển thị theo Gibibyte nhị phân (`2^30` byte).',
        },
        {
          question: 'Bộ chuyển đổi hệ cơ số có xử lý được số nguyên 64-bit hay 128-bit không?',
          answer: 'Có, `BigInt` hỗ trợ số nguyên lớn tùy ý mà không mất độ chính xác.',
        },
      ],
    },
    'git-cheatsheet': {
      name: 'Sổ tay Git & GitHub CLI',
      shortDescription: 'Tra cứu nhanh lệnh Git & `gh` với sao chép một chạm và ghim lệnh.',
      longDescription:
        'Tìm và sao chép nhanh các lệnh Git rẽ nhánh, rebase tương tác, khôi phục reflog, worktree và GitHub CLI (`gh`).',
      keywords: ['git', 'github', 'gh cli', 'rebase', 'reflog', 'stash', 'cheatsheet'],
      howItWorks: [
        'Sắp xếp các quy trình Git & `gh` thực tế thành các thẻ lệnh Bento dễ lọc.',
        'Hỗ trợ lọc từ khóa tức thì theo cờ lệnh và mô tả.',
        'Cho phép ghim các lệnh hay dùng trực tiếp vào bộ nhớ không gian làm việc.',
      ],
      faqs: [
        {
          question: 'Làm sao hoàn tác một lệnh `git reset --hard` bị nhầm?',
          answer:
            'Chạy `git reflog` để tìm mã SHA commit trước đó rồi khôi phục bằng `git checkout -b recovery <sha>`.',
        },
        {
          question: 'Tôi có thể ghim các lệnh dùng nhiều nhất không?',
          answer:
            'Có, nhấn biểu tượng ghim trên bất kỳ thẻ lệnh nào để giữ nổi bật qua các phiên làm việc.',
        },
      ],
    },
    'http-cheatsheet': {
      name: 'Tra cứu Mã trạng thái & Header HTTP',
      shortDescription: 'Tìm kiếm mã trạng thái 1xx–5xx, caching, CORS và header bảo mật.',
      longDescription:
        'Tra cứu mã phản hồi HTTP, ngữ nghĩa RFC, chỉ thị Cache-Control, header CORS preflight và các header bảo mật hiện đại.',
      keywords: [
        'http',
        'mã trạng thái',
        '404',
        '429',
        '502',
        'cors',
        'cache-control',
        'headers',
      ],
      howItWorks: [
        'Phân nhóm mã HTTP theo 1xx Thông tin, 2xx Thành công, 3xx Chuyển hướng, 4xx Lỗi Client và 5xx Lỗi Server.',
        'Kèm sẵn mẫu header cho CORS, CSP, HSTS và Cache-Control.',
        'Lọc tức thì theo mã số trạng thái, tên header hoặc tình huống sử dụng.',
      ],
      faqs: [
        {
          question: 'Khi nào API nên trả về 401 so với 403?',
          answer:
            '401 Unauthorized khi thiếu hoặc sai thông tin xác thực; 403 Forbidden khi đã xác thực nhưng không đủ quyền.',
        },
        {
          question: 'Khác nhau giữa chuyển hướng 301 và 308 là gì?',
          answer:
            'Cả hai đều là chuyển hướng vĩnh viễn, nhưng 308 đảm bảo giữ nguyên phương thức HTTP (như POST).',
        },
      ],
    },
    'devops-cheatsheet': {
      name: 'Sổ tay Regex, Linux CLI & Docker',
      shortDescription: 'Các mẫu Regex thiết yếu, chẩn đoán Linux và lệnh Docker CLI.',
      longDescription:
        'Sổ tay sao chép một chạm bao gồm lookaround Regex phổ biến, chẩn đoán Linux `ss`/`lsof`/`journalctl` và thao tác Docker/Compose.',
      keywords: ['docker', 'linux', 'bash', 'regex', 'lsof', 'systemd', 'devops', 'cheatsheet'],
      howItWorks: [
        'Nhóm các lệnh thực chiến thành Mẫu Regex, Mạng & Tiến trình Linux và Docker/Container.',
        'Cung cấp sao chép một chạm kèm xác nhận trực quan.',
        'Lưu bền vững các đoạn ghim cục bộ hoặc trên Supabase khi đã cấu hình.',
      ],
      faqs: [
        {
          question: 'Làm sao kiểm tra tiến trình nào đang lắng nghe trên một cổng ở Linux?',
          answer: 'Dùng lệnh `ss -tulpn | grep :3000` hoặc `lsof -i :3000`.',
        },
        {
          question: 'Làm sao dọn các Docker image lơ lửng an toàn?',
          answer:
            'Chạy `docker image prune` để dọn các layer chưa gắn thẻ mà không đụng vào container đang chạy.',
        },
      ],
    },
    'keyboard-tester': {
      name: 'Kiểm tra Bàn phím & NKRO',
      shortDescription: 'Kiểm tra phím bấm, đa phím NKRO, cảnh báo chatter & mã sự kiện.',
      longDescription:
        'Kiểm tra bàn phím ANSI Full-Size 104 và TKL 80 với nhãn Windows/Mac, đo số phím nhận đồng thời NKRO, phát hiện kẹt/lặp phím, chế độ Capture Mode và xem chi tiết KeyboardEvent.',
      keywords: ['bàn phím', 'keyboard', 'keyboard tester', 'nkro', 'lặp phím', 'chatter', 'kiểm tra phím'],
      howItWorks: [
        'Lắng nghe sự kiện `keydown` và `keyup` cục bộ với tùy chọn Capture Mode (`Esc × 2` để mở khóa) nhằm bắt cả phím tắt trình duyệt.',
        'Theo dõi phím đang giữ, tỷ lệ phím đã kiểm tra, số phím bấm đồng thời tối đa (NKRO) và lỗi lặp phím dưới 40ms.',
        'Hiển thị trực tiếp `code`, `key`, `location`, `keyCode`, phím bổ trợ và thời gian chênh lệch giữa các lần nhấn.',
      ],
      faqs: [
        {
          question: 'Làm sao thoát Capture Mode an toàn?',
          answer:
            'Nhấn phím Escape hai lần liên tiếp (`Esc × 2`) hoặc nhấn nút Mở khóa trên thanh công cụ để khôi phục phím tắt trình duyệt.',
        },
        {
          question: 'Lỗi lặp phím (key chatter) là gì và được phát hiện thế nào?',
          answer:
            'Key chatter xảy ra khi switch cơ bị mòn ghi nhận hai lần nhấn ngoài ý muốn trong khoảng dưới ~40 mili-giây sau lần nhấn trước.',
        },
      ],
    },
    'mic-tester': {
      name: 'Kiểm tra Micro & Phân tích Âm thanh',
      shortDescription: 'Theo dõi mức dBFS trực tiếp, dạng sóng/phổ FFT & nghe lại cục bộ.',
      longDescription:
        'Kiểm tra độ rõ của micro cục bộ qua Web Audio API với chọn thiết bị đầu vào, biểu đồ sóng âm và phổ tần số FFT thời gian thực, cảnh báo rè/clipping và ghi âm thử tối đa 15 giây.',
      keywords: ['micro', 'mic', 'microphone', 'dbfs', 'waveform', 'spectrum', 'ghi âm'],
      howItWorks: [
        'Yêu cầu quyền truy cập micro cục bộ qua `navigator.mediaDevices.getUserMedia` hoàn toàn trong tab trình duyệt.',
        'Phân tích khung tín hiệu miền thời gian và tần số bằng `AnalyserNode` để tính RMS/Peak dBFS và phân loại mức nhiễu nền hoặc vỡ tiếng.',
        'Hỗ trợ ghi thử qua `MediaRecorder` tối đa 15 giây để nghe lại và tải về ngay mà không tải âm thanh lên máy chủ.',
      ],
      faqs: [
        {
          question: 'Âm thanh từ micro có bị tải lên hay lưu ở máy chủ không?',
          answer:
            'Không. Toàn bộ luồng âm thanh, biểu đồ và đoạn ghi thử 15 giây chỉ tồn tại trong bộ nhớ trình duyệt của bạn.',
        },
        {
          question: 'Vì sao kiểm tra micro cần HTTPS hoặc localhost?',
          answer:
            'Trình duyệt giới hạn `navigator.mediaDevices` chỉ hoạt động trong Ngữ cảnh Bảo mật (`https://` hoặc `localhost`) để bảo vệ quyền riêng tư.',
        },
      ],
    },
    'speaker-tester': {
      name: 'Kiểm tra Loa & Tai nghe Stereo',
      shortDescription: 'Kiểm tra kênh Trái/Phải, quét dải tần 20Hz–20kHz & âm chuẩn an toàn.',
      longDescription:
        'Kiểm tra đấu nối kênh trái/phải và đáp ứng tần số của loa bằng bộ tổng hợp Web Audio (âm đơn 440Hz/1kHz, quét logarit 20Hz–20kHz, nhiễu trắng/hồng và chuông mẫu) qua bộ giới hạn bảo vệ thính giác.',
      keywords: ['loa', 'tai nghe', 'speaker', 'headphone', 'stereo', 'left right', 'kiểm tra loa'],
      howItWorks: [
        'Định tuyến tín hiệu tổng hợp qua `ChannelMergerNode(2)` để tách bạch hoàn toàn kênh Trái, Stereo hoặc Phải.',
        'Áp dụng bộ giới hạn an toàn `DynamicsCompressorNode` và khởi đầu ở mức âm lượng mặc định 35% để bảo vệ thính giác.',
        'Cho phép chuyển đổi thiết bị đầu ra trên các trình duyệt hỗ trợ `AudioContext.setSinkId()`.',
      ],
      faqs: [
        {
          question: 'Vì sao âm lượng mặc định được đặt ở mức 35%?',
          answer:
            'Mức khởi đầu 35% kết hợp bộ nén giới hạn giúp ngăn âm kiểm tra quá lớn gây hại cho tai hoặc tai nghe.',
        },
        {
          question: 'Nếu trình duyệt không hỗ trợ chọn thiết bị đầu ra thì sao?',
          answer:
            'Một số trình duyệt (như Safari hoặc Firefox) chưa mở API `setSinkId`; âm thanh sẽ tự động phát qua thiết bị mặc định của hệ thống.',
        },
      ],
    },
    'speed-test': {
      name: 'Đo Tốc độ Mạng & Độ trễ',
      shortDescription: 'Đo Ping, Jitter, Download & Upload trực tiếp trên máy chủ nguồn.',
      longDescription:
        'Đo độ phản hồi và băng thông kết nối tới endpoint cùng nguồn với chế độ Nhanh hoặc Chuẩn, biểu đồ thông lượng SVG thời gian thực, xếp hạng tác vụ và lịch sử đo cục bộ.',
      keywords: ['speed test', 'tốc độ mạng', 'ping', 'jitter', 'download', 'upload', 'bandwidth'],
      howItWorks: [
        'Đo độ trễ khứ hồi (Ping) và biến động độ trễ (Jitter) qua chuỗi probe cùng nguồn.',
        'Truyền dữ liệu ngẫu nhiên khó nén qua `ReadableStream` để đo tốc độ tải xuống và theo dõi `XMLHttpRequest.upload.onprogress` cho tốc độ tải lên.',
        'Đánh giá mức độ phù hợp cho Gọi video, Xem 4K, Chơi game và Đồng bộ đám mây, đồng thời lưu tối đa 20 lần đo trong localStorage.',
      ],
      faqs: [
        {
          question: 'Công cụ đo tốc độ này có kết nối tới máy chủ bên thứ ba không?',
          answer:
            'Không. Mọi lượt đo chỉ gửi yêu cầu tới các endpoint cùng nguồn `/api/speedtest/*` và không lưu dữ liệu tải lên.',
        },
        {
          question: 'Chế độ Nhanh và Chuẩn khác nhau như thế nào?',
          answer:
            'Chế độ Nhanh dùng dung lượng nhỏ để kiểm tra sơ bộ nhanh chóng, còn chế độ Chuẩn truyền nhiều megabyte để lấy giá trị băng thông ổn định hơn.',
        },
      ],
    },
  },
};
