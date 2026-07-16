class ApiConstants {
  ApiConstants._();

  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:5000/api',
  );

  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String verifyOtp = '/auth/verify-otp';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';
  static const String refreshToken = '/auth/refresh';
  static const String profile = '/auth/profile';

  static const String users = '/users';
  static const String students = '/students';
  static const String teachers = '/teachers';
  static const String staff = '/staff';
  static const String parents = '/parents';

  static const String dashboard = '/dashboard';
  static const String dashboardStats = '/dashboard/stats';
  static const String dashboardChart = '/dashboard/chart';

  static const String attendance = '/attendance';
  static const String attendanceBulk = '/attendance/bulk';
  static const String attendanceReport = '/attendance/report';

  static const String exams = '/exams';
  static const String examResults = '/exams/results';
  static const String examMarks = '/exams/marks';

  static const String fees = '/fees';
  static const String feeCollection = '/fees/collection';
  static const String feeReport = '/fees/report';
  static const String feeChallan = '/fees/challan';

  static const String classes = '/classes';
  static const String courses = '/courses';
  static const String departments = '/departments';
  static const String programs = '/programs';
  static const String semesters = '/semesters';
  static const String timetable = '/timetable';
  static const String notifications = '/notifications';
  static const String reports = '/reports';
  static const String fcmToken = '/notifications/fcm-token';
}
