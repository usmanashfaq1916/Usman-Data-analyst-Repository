import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import '../../domain/entities/user.dart';
import '../providers/auth_provider.dart';
import '../providers/theme_provider.dart';

class AppDrawer extends ConsumerWidget {
  final User user;

  const AppDrawer({super.key, required this.user});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [AppColors.primary, AppColors.primaryLight],
              ),
            ),
            currentAccountPicture: CircleAvatar(
              backgroundColor: AppColors.accent,
              child: Text(
                user.initials,
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
            accountName: Text(
              user.fullName,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
            accountEmail: Text(user.email),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _buildTile(Icons.dashboard, 'Dashboard', onTap: () => _navigate(context, '/')),
                _buildTile(Icons.people, 'Students', onTap: () => _navigate(context, '/students')),
                _buildTile(Icons.calendar_today, 'Attendance', onTap: () => _navigate(context, '/attendance')),
                _buildTile(Icons.school, 'Exams', onTap: () => _navigate(context, '/exams')),
                _buildTile(Icons.payments, 'Fees', onTap: () => _navigate(context, '/fees')),
                _buildTile(Icons.people_outline, 'Teachers', onTap: () => _navigate(context, '/teachers')),
                _buildTile(Icons.schedule, 'Timetable', onTap: () => _navigate(context, '/timetable')),
                _buildTile(Icons.book, 'Library', onTap: () => _navigate(context, '/library')),
                _buildTile(Icons.directions_bus, 'Transport', onTap: () => _navigate(context, '/transport')),
                _buildTile(Icons.business, 'Hostel', onTap: () => _navigate(context, '/hostel')),
                _buildTile(Icons.report, 'Reports', onTap: () => _navigate(context, '/reports')),
                const Divider(),
                _buildTile(
                  isDark ? Icons.light_mode : Icons.dark_mode,
                  isDark ? 'Light Mode' : 'Dark Mode',
                  trailing: Switch(
                    value: isDark,
                    onChanged: (_) => ref.read(themeModeProvider.notifier).toggleTheme(),
                  ),
                ),
                _buildTile(Icons.logout, 'Logout',
                    textColor: Colors.red,
                    onTap: () async {
                      Navigator.pop(context);
                      await ref.read(authProvider.notifier).logout();
                    }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTile(IconData icon, String label,
      {VoidCallback? onTap, Color? textColor, Widget? trailing}) {
    return ListTile(
      leading: Icon(icon, color: textColor),
      title: Text(label, style: TextStyle(color: textColor)),
      trailing: trailing,
      onTap: onTap,
    );
  }

  void _navigate(BuildContext context, String route) {
    Navigator.pop(context);
    Navigator.pushReplacementNamed(context, route);
  }
}
