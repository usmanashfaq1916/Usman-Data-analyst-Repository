class Validators {
  Validators._();

  static String? email(String? value) {
    if (value == null || value.isEmpty) return 'Email is required';
    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) return 'Invalid email address';
    return null;
  }

  static String? password(String? value) {
    if (value == null || value.isEmpty) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  static String? phone(String? value) {
    if (value == null || value.isEmpty) return 'Phone number is required';
    final phoneRegex = RegExp(r'^\+?[\d\s-]{10,15}$');
    if (!phoneRegex.hasMatch(value)) return 'Invalid phone number';
    return null;
  }

  static String? required(String? value, [String field = 'This field']) {
    if (value == null || value.trim().isEmpty) return '$field is required';
    return null;
  }

  static String? cnic(String? value) {
    if (value == null || value.isEmpty) return 'CNIC is required';
    final cnicRegex = RegExp(r'^\d{5}-\d{7}-\d{1}$');
    if (!cnicRegex.hasMatch(value)) return 'Invalid CNIC format (xxxxx-xxxxxxx-x)';
    return null;
  }

  static String? number(String? value, [String field = 'Value']) {
    if (value == null || value.isEmpty) return '$field is required';
    if (double.tryParse(value) == null) return 'Invalid number';
    return null;
  }

  static String? minLength(String? value, int min, [String field = 'Value']) {
    if (value == null || value.isEmpty) return '$field is required';
    if (value.length < min) return '$field must be at least $min characters';
    return null;
  }

  static String? confirmPassword(String? value, String password) {
    if (value == null || value.isEmpty) return 'Confirm password is required';
    if (value != password) return 'Passwords do not match';
    return null;
  }
}
