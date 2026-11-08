const vi = {
  // ---- Brand / Nav ----
  brand: 'G-Scores',
  nav: {
    dashboard: 'Tổng quan',
    search: 'Tra cứu điểm',
    reports: 'Thống kê',
  },
  sidebarNote:
    'Dựa trên 1.061.605 thí sinh kỳ thi tốt nghiệp THPT quốc gia 2024.',

  // ---- Dashboard ----
  dashboard: {
    title: 'Học sinh xuất sắc nhất khối A',
    description: 'Top 10 học sinh có tổng điểm Toán, Lý, Hóa cao nhất.',
    loading: 'Đang tải danh sách. Lần đầu có thể mất vài giây.',
    colRank: 'Hạng',
    colSbd: 'Số báo danh',
    colMath: 'Toán',
    colPhysics: 'Lý',
    colChemistry: 'Hóa',
    colTotal: 'Tổng',
  },

  // ---- Search ----
  search: {
    title: 'Tra cứu điểm',
    description:
      'Nhập số báo danh gồm 8 chữ số để xem kết quả của thí sinh đó trong từng môn.',
    labelSbd: 'Số báo danh',
    placeholder: 'vd. 01000001',
    buttonLookup: 'Tra cứu',
    buttonLoading: 'Đang tra cứu...',
    hintNoNumber: 'Chưa có số báo danh?',
    hintUse: 'Dùng {{sbd}}',
    validationLength: 'Vui lòng nhập đủ {{n}} chữ số của số báo danh.',
    loadingScores: 'Đang tra cứu điểm...',
    emptyState: 'Kết quả sẽ hiển thị sau khi bạn nhập số báo danh.',
    labelRegNumber: 'Số báo danh',
    labelForeignCode: 'Mã ngoại ngữ',
    slipNote: 'Các vạch trên thanh điểm đánh dấu mức 4, 6 và 8 điểm.',
    notTaken: 'Không thi',
  },

  // ---- Subjects ----
  subjects: {
    math: 'Toán',
    literature: 'Ngữ văn',
    foreignLanguage: 'Ngoại ngữ',
    physics: 'Vật lý',
    chemistry: 'Hóa học',
    biology: 'Sinh học',
    history: 'Lịch sử',
    geography: 'Địa lý',
    civicEducation: 'GDCD',
  },

  // ---- Reports ----
  reports: {
    title: 'Phân phối điểm',
    description:
      'Số lượng thí sinh theo từng mức điểm cho từng môn. Thí sinh không thi môn nào sẽ không được tính vào môn đó.',
    loading: 'Đang tổng hợp dữ liệu. Lần đầu có thể mất vài giây.',
    scrollHint: 'Vuốt ngang để xem tất cả các môn.',
    viewNumbers: 'Xem số liệu chi tiết',
    colSubject: 'Môn học',
    colStudents: 'Thí sinh',
  },

  // ---- Levels ----
  levels: {
    excellent: 'Giỏi',
    good: 'Khá',
    average: 'Trung bình',
    poor: 'Yếu',
    ranges: {
      excellent: 'Từ 8 trở lên',
      good: 'Từ 6 đến dưới 8',
      average: 'Từ 4 đến dưới 6',
      poor: 'Dưới 4',
    },
  },

  // ---- Shared ----
  shared: {
    tryAgain: 'Thử lại',
    errorServer: 'Không thể kết nối máy chủ. Máy chủ có thể đang khởi động, vui lòng thử lại.',
  },
} as const

export default vi
