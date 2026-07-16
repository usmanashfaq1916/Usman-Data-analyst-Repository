class AppConstants {
  AppConstants._();

  static const String appName = 'QEC HMIS';
  static const String appVersion = '1.0.0';
  static const String noInternet = 'No internet connection';
  static const String serverError = 'Server error. Please try again.';
  static const String unknownError = 'Something went wrong';
  static const String sessionExpired = 'Session expired. Please login again.';

  static const int connectTimeout = 15000;
  static const int receiveTimeout = 15000;
  static const int pageSize = 20;
  static const int cacheExpiryHours = 24;
  static const int otpResendSeconds = 30;
  static const int biometricTimeout = 30;

  static const String dateFormat = 'dd-MM-yyyy';
  static const String dateTimeFormat = 'dd-MM-yyyy HH:mm';
  static const String timeFormat = 'HH:mm';
  static const String serverDateFormat = 'yyyy-MM-dd';
  static const String serverDateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
}
