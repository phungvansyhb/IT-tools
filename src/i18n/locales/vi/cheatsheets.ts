import type { CheatsheetsDictionary } from '../../types';

export const viCheatsheets: CheatsheetsDictionary = {
  entries: {
    'git-interactive-rebase': {
      group: 'Nhánh & Rebase',
      title: 'Rebase Tương tác N Commit Gần nhất',
      description: 'Gộp (squash), sắp xếp lại hoặc sửa 5 commit gần nhất trên nhánh hiện tại.',
      tags: ['git', 'rebase', 'squash', 'lịch sử'],
    },
    'git-reflog-recover': {
      group: 'Khôi phục',
      title: 'Khôi phục Commit Mất qua Reflog',
      description: 'Kiểm tra lịch sử di chuyển HEAD và cứu commit sau khi lỡ chạy hard reset.',
      tags: ['git', 'reflog', 'reset', 'hoàn tác'],
    },
    'git-worktree-add': {
      group: 'Worktree',
      title: 'Tạo Worktree Song song',
      description: 'Checkout nhánh khác trong thư mục riêng mà không cần stash.',
      tags: ['git', 'worktree', 'branch'],
    },
    'git-amend-no-edit': {
      group: 'Commit',
      title: 'Bổ sung Thay đổi Vào Commit Cuối',
      description: 'Gộp các thay đổi đã stage vào commit trước đó và giữ nguyên thông điệp.',
      tags: ['git', 'commit', 'amend'],
    },
    'git-stash-untracked': {
      group: 'Stash',
      title: 'Stash Đặt tên Bao gồm Tệp Chưa Theo dõi',
      description: 'Lưu tạm cả tệp đã theo dõi và chưa theo dõi kèm nhãn mô tả rõ ràng.',
      tags: ['git', 'stash', 'wip'],
    },
    'gh-pr-create': {
      group: 'GitHub CLI',
      title: 'Tạo Pull Request Nháp & Tự điền Thông tin',
      description: 'Mở Pull Request nháp bằng tiêu đề và nội dung commit tự động.',
      tags: ['gh', 'github', 'pr', 'pull request'],
    },
    'gh-pr-checks': {
      group: 'GitHub CLI',
      title: 'Theo dõi Trạng thái CI của PR',
      description: 'Xem trực tiếp luồng trạng thái kiểm tra GitHub Actions cho PR của nhánh hiện tại.',
      tags: ['gh', 'ci', 'actions', 'checks'],
    },
    'http-200-204': {
      group: '2xx Thành công',
      title: '200 OK / 201 Created / 204 No Content',
      description: 'Dùng 201 khi tạo tài nguyên mới, 204 khi DELETE/PUT không trả về body.',
      tags: ['http', '200', '201', '204', 'rest'],
    },
    'http-301-308': {
      group: '3xx Chuyển hướng',
      title: 'Chuyển hướng Vĩnh viễn 301 vs 308',
      description: '308 giữ nguyên phương thức POST/PUT, khác với 301 có thể bị hạ xuống GET.',
      tags: ['http', '301', '308', 'chuyển hướng'],
    },
    'http-401-403': {
      group: '4xx Lỗi Client',
      title: '401 Unauthorized vs 403 Forbidden',
      description: 'Trả về 401 khi thiếu/hết hạn xác thực; 403 khi người gọi thiếu quyền RBAC.',
      tags: ['http', '401', '403', 'xác thực'],
    },
    'http-422-429': {
      group: '4xx Lỗi Client',
      title: '422 Unprocessable Content & 429 Rate Limit',
      description: '422 báo lỗi xác thực schema; 429 giới hạn tần suất API kèm Retry-After.',
      tags: ['http', '422', '429', 'giới hạn tốc độ'],
    },
    'http-502-504': {
      group: '5xx Lỗi Server',
      title: '502 Bad Gateway / 503 Unavailable / 504 Timeout',
      description: 'Phân biệt lỗi phản hồi upstream từ reverse-proxy với việc máy chủ gốc ngừng hoạt động.',
      tags: ['http', '502', '503', '504', 'gateway'],
    },
    'http-cache-control': {
      group: 'Header Bộ nhớ đệm',
      title: 'Cache Tài nguyên Tĩnh Bất biến',
      description: 'Lưu cache mạnh mẽ cho các gói JS/CSS đã gắn hash nội dung mà không cần kiểm tra lại.',
      tags: ['http', 'cache-control', 'cdn', 'hiệu năng'],
    },
    'http-cors-preflight': {
      group: 'CORS & Bảo mật',
      title: 'CORS Nghiêm ngặt + Header Bảo mật',
      description: 'Kết hợp với Strict-Transport-Security và X-Content-Type-Options: nosniff.',
      tags: ['http', 'cors', 'bảo mật', 'hsts'],
    },
    'regex-lookahead-password': {
      group: 'Mẫu Regex',
      title: 'Xác thực Positive Lookahead',
      description: 'Yêu cầu ít nhất 1 chữ hoa, 1 chữ số và độ dài tối thiểu 12 ký tự.',
      tags: ['regex', 'lookahead', 'xác thực'],
    },
    'regex-named-group': {
      group: 'Mẫu Regex',
      title: 'Nhóm Bắt giữ Có tên (ECMAScript)',
      description: 'Trích xuất các thành phần ngày ISO gọn gàng vào `match.groups.year`.',
      tags: ['regex', 'nhóm', 'iso'],
    },
    'linux-ss-ports': {
      group: 'Linux CLI',
      title: 'Kiểm tra Cổng TCP/UDP Đang Lắng nghe',
      description: 'Liệt kê các socket đang mở và PID sở hữu nhanh hơn netstat.',
      tags: ['linux', 'ss', 'cổng', 'mạng'],
    },
    'linux-journalctl-tail': {
      group: 'Linux CLI',
      title: 'Theo dõi Log Dịch vụ Systemd',
      description: 'Xem trực tiếp nhật ký systemd unit được lọc trong 15 phút gần nhất.',
      tags: ['linux', 'systemd', 'logs', 'journalctl'],
    },
    'docker-exec-shell': {
      group: 'Docker',
      title: 'Mở Shell Tương tác Trong Container',
      description: 'Gắn phiên terminal tương tác vào một container Alpine/Debian đang chạy.',
      tags: ['docker', 'exec', 'shell', 'container'],
    },
    'docker-compose-rebuild': {
      group: 'Docker',
      title: 'Build lại & Tạo lại Dịch vụ Compose',
      description: 'Build lại image, khởi động lại dịch vụ thay đổi ở chế độ nền và dọn container thừa.',
      tags: ['docker', 'compose', 'build'],
    },
  },
};
