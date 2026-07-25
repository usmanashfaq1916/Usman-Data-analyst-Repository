import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/timetable_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class TimetableScreen extends ConsumerStatefulWidget {
  const TimetableScreen({super.key});

  @override
  ConsumerState<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends ConsumerState<TimetableScreen> {
  static const _days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(timetableProvider.notifier).loadTimetable();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(timetableProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Timetable'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(timetableProvider.notifier).loadTimetable(),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildDayTabs(state.selectedDay),
          Expanded(
            child: state.isLoading
                ? const LoadingWidget()
                : state.error != null
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () => ref.read(timetableProvider.notifier).loadTimetable(),
                      )
                    : state.entries.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No classes scheduled for this day',
                            icon: Icons.calendar_view_week,
                          )
                        : _buildTimetableList(state.entries, isDark),
          ),
        ],
      ),
    );
  }

  Widget _buildDayTabs(String selectedDay) {
    return Container(
      height: 48,
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        itemCount: _days.length,
        itemBuilder: (context, index) {
          final day = _days[index];
          final isSelected = day == selectedDay;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: ChoiceChip(
              label: Text(day.substring(0, 3)),
              selected: isSelected,
              onSelected: (_) {
                ref.read(timetableProvider.notifier).setDay(day);
                ref.read(timetableProvider.notifier).loadTimetable();
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimetableList(List entries, bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: entries.length,
      itemBuilder: (context, index) {
        final entry = entries[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  width: 60,
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    children: [
                      Text(
                        entry.startTime.length >= 5 ? entry.startTime.substring(0, 5) : entry.startTime,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: AppColors.primary,
                        ),
                      ),
                      const Text('-', style: TextStyle(fontSize: 11, color: AppColors.primary)),
                      Text(
                        entry.endTime.length >= 5 ? entry.endTime.substring(0, 5) : entry.endTime,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 13,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        entry.courseName ?? 'Lecture',
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                      ),
                      const SizedBox(height: 4),
                      if (entry.teacherName != null)
                        Text(
                          entry.teacherName!,
                          style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                        ),
                      if (entry.room != null)
                        Text(
                          'Room: ${entry.room}',
                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
