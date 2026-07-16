import 'package:intl/intl.dart';
import 'package:flutter/material.dart';

extension DateTimeFormatting on DateTime {
  String get formattedDate => DateFormat('dd-MM-yyyy').format(this);
  String get formattedTime => DateFormat('HH:mm').format(this);
  String get formattedDateTime => DateFormat('dd-MM-yyyy HH:mm').format(this);
  String get serverFormat => DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").format(this);
  String get serverDateFormat => DateFormat('yyyy-MM-dd').format(this);
}

extension StringCasing on String {
  String get capitalize => length > 0 ? '${this[0].toUpperCase()}${substring(1)}' : this;
  String get titleCase => split(' ').map((w) => w.capitalize).join(' ');
  String get initials => split(' ').where((w) => w.isNotEmpty).map((w) => w[0].toUpperCase()).take(2).join();
}

extension BuildContextExtensions on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  Size get screenSize => MediaQuery.of(this).size;
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
  bool get isTablet => MediaQuery.of(this).size.shortestSide >= 600;
  bool get isLandscape => MediaQuery.of(this).orientation == Orientation.landscape;
}

extension NumberFormatting on double {
  String get currency => 'Rs. ${toStringAsFixed(0)}';
  String get percentage => '${toStringAsFixed(1)}%';
}

extension IntFormatting on int {
  String get currency => 'Rs. $this';
}

extension StringToColor on String {
  Color toColor() {
    final hex = replaceAll('#', '');
    return Color(int.parse('FF$hex', radix: 16));
  }
}
