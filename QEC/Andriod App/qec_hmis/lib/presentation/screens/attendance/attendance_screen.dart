import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/attendance_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../domain/entities/attendance.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class AttendanceScreen extends ConsumerStatefulWidget {
  const AttendanceScreen({super.key});

  @override
  ConsumerState<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends ConsumerState<AttendanceScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(attendanceProvider.notifier).loadAttendance();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(attendanceProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
        actions: [
          IconButton(
            icon: const Icon(Icons.calendar_month),
            onPressed: () => _pickDate(context),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildDateNavigator(state.selectedDate, isDark),
          if (state.stats != null) _buildStatsBar(state.stats!, isDark),
          Expanded(
            child: state.isLoading
                ? const LoadingWidget()
                : state.error != null
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () => ref
                            .read(attendanceProvider.notifier)
                            .loadAttendance(),
                      )
                    : state.attendanceList.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No attendance records for this date',
                            icon: Icons.calendar_today,
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: state.attendanceList.length + 1,
                            itemBuilder: (context, index) {
                              if (index == state.attendanceList.length) {
                                return Padding(
                                  padding: const EdgeInsets.only(top: 16),
                                  child: SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: () => _submitAttendance(state),
                                      icon: const Icon(Icons.save),
                                      label: const Text('Save Attendance'),
                                    ),
                                  ),
                                );
                              }
                              return _buildAttendanceItem(
                                index,
                                state.attendanceList[index],
                                isDark,
                              );
                            },
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildDateNavigator(DateTime selectedDate, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            onPressed: () {
              final newDate = selectedDate.subtract(const Duration(days: 1));
              ref.read(attendanceProvider.notifier).loadAttendance(date: newDate);
            },
          ),
          Column(
            children: [
              Text(
                selectedDate.formattedDate,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                _getDayName(selectedDate.weekday),
                style: TextStyle(fontSize: 12, color: Colors.grey[600]),
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right),
            onPressed: () {
              final newDate = selectedDate.add(const Duration(days: 1));
              ref.read(attendanceProvider.notifier).loadAttendance(date: newDate);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStatsBar(AttendanceStats stats, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.darkCard : Colors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _statChip('P', '${stats.present}', AppColors.success),
          _statChip('A', '${stats.absent}', AppColors.error),
          _statChip('L', '${stats.late}', AppColors.warning),
          _statChip('%', '${stats.percentage.toStringAsFixed(1)}%', AppColors.info),
        ],
      ),
    );
  }

  Widget _statChip(String label, String count, Color color) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          count,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
        ),
      ],
    );
  }

  Widget _buildAttendanceItem(int index, Attendance attendance, bool isDark) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(attendance.status).withValues(alpha: 0.1),
          child: Text(
            attendance.rollNumber?.substring(0, 2) ?? '??',
            style: TextStyle(
              color: _getStatusColor(attendance.status),
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
        title: Text(
          attendance.studentName ?? 'Student #${attendance.studentId.substring(0, 6)}',
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        subtitle: Text(
          attendance.rollNumber ?? '',
          style: const TextStyle(fontSize: 12),
        ),
        trailing: DropdownButton<AttendanceStatus>(
          value: attendance.status,
          underline: const SizedBox(),
          items: AttendanceStatus.values.map((status) {
            return DropdownMenuItem(
              value: status,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(status).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  status.name,
                  style: TextStyle(
                    color: _getStatusColor(status),
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
            );
          }).toList(),
          onChanged: (status) {
            if (status != null) {
              ref
                  .read(attendanceProvider.notifier)
                  .toggleStatus(index, status);
            }
          },
        ),
      ),
    );
  }

  Color _getStatusColor(AttendanceStatus status) {
    switch (status) {
      case AttendanceStatus.PRESENT:
        return AppColors.success;
      case AttendanceStatus.ABSENT:
        return AppColors.error;
      case AttendanceStatus.LATE:
        return AppColors.warning;
      case AttendanceStatus.EXCUSED:
        return AppColors.info;
    }
  }

  String _getDayName(int weekday) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[weekday - 1];
  }

  Future<void> _pickDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );
    if (picked != null) {
      ref.read(attendanceProvider.notifier).loadAttendance(date: picked);
    }
  }

  void _submitAttendance(dynamic state) {
    ref.read(attendanceProvider.notifier).markBulk(state.attendanceList);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Attendance saved successfully')),
    );
  }
}
