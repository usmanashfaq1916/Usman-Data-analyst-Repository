import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/dashboard_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class ReportsScreen extends ConsumerStatefulWidget {
  const ReportsScreen({super.key});

  @override
  ConsumerState<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends ConsumerState<ReportsScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(dashboardProvider.notifier).loadDashboard();
    });
  }

  @override
  Widget build(BuildContext context) {
    final dashState = ref.watch(dashboardProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(dashboardProvider.notifier).loadDashboard(),
          ),
        ],
      ),
      body: dashState.isLoading
          ? const LoadingWidget()
          : dashState.error != null
              ? AppErrorWidget(
                  message: dashState.error!,
                  onRetry: () => ref.read(dashboardProvider.notifier).loadDashboard(),
                )
              : RefreshIndicator(
                  onRefresh: () => ref.read(dashboardProvider.notifier).loadDashboard(),
                  child: ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _buildSection('Student Reports', Icons.people, [
                        _reportTile('Student List', 'View all enrolled students', Icons.list),
                        _reportTile('Enrollment Analysis', 'New vs continuing students', Icons.trending_up),
                        _reportTile('Campus Distribution', 'Students per campus', Icons.business),
                      ]),
                      const SizedBox(height: 16),
                      _buildSection('Academic Reports', Icons.school, [
                        _reportTile('Attendance Summary', 'Overall attendance statistics', Icons.calendar_month),
                        _reportTile('Exam Results', 'Grade distribution & pass rates', Icons.grading),
                        _reportTile('Class Performance', 'Per-class academic performance', Icons.analytics),
                      ]),
                      const SizedBox(height: 16),
                      _buildSection('Financial Reports', Icons.attach_money, [
                        _reportTile('Fee Collection', 'Fee collection vs outstanding', Icons.account_balance),
                        _reportTile('Monthly Revenue', 'Revenue trends', Icons.trending_up),
                        _reportTile('Pending Dues', 'Outstanding fee report', Icons.warning_amber),
                      ]),
                      const SizedBox(height: 16),
                      _buildSection('Staff Reports', Icons.badge, [
                        _reportTile('Teacher List', 'Faculty directory', Icons.school),
                        _reportTile('Staff Attendance', 'Staff attendance records', Icons.access_time),
                      ]),
                    ],
                  ),
                ),
    );
  }

  Widget _buildSection(String title, IconData icon, List<Widget> children) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                Icon(icon, size: 20, color: AppColors.primary),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
          ...children,
        ],
      ),
    );
  }

  Widget _reportTile(String title, String subtitle, IconData icon) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, size: 20, color: AppColors.primary),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 14)),
      subtitle: Text(subtitle, style: const TextStyle(fontSize: 12)),
      trailing: const Icon(Icons.chevron_right),
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('$title report coming soon')),
        );
      },
    );
  }
}
