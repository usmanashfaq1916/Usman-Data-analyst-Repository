import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/teacher_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class TeacherListScreen extends ConsumerStatefulWidget {
  const TeacherListScreen({super.key});

  @override
  ConsumerState<TeacherListScreen> createState() => _TeacherListScreenState();
}

class _TeacherListScreenState extends ConsumerState<TeacherListScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(teacherProvider.notifier).loadTeachers();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(teacherProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Teachers'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(teacherProvider.notifier).loadTeachers(refresh: true),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(
            child: state.isLoading && state.teachers.isEmpty
                ? const LoadingWidget()
                : state.error != null && state.teachers.isEmpty
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () =>
                            ref.read(teacherProvider.notifier).loadTeachers(),
                      )
                    : state.teachers.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No teachers found',
                            icon: Icons.school,
                          )
                        : _buildTeacherList(state, isDark),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Search teachers...',
          prefixIcon: const Icon(Icons.search),
          suffixIcon: _searchController.text.isNotEmpty
              ? IconButton(
                  icon: const Icon(Icons.clear),
                  onPressed: () {
                    _searchController.clear();
                    ref.read(teacherProvider.notifier).searchTeachers('');
                  },
                )
              : null,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          filled: true,
          contentPadding: const EdgeInsets.symmetric(vertical: 12),
        ),
        onChanged: (value) {
          ref.read(teacherProvider.notifier).searchTeachers(value);
        },
      ),
    );
  }

  Widget _buildTeacherList(TeacherState state, bool isDark) {
    return RefreshIndicator(
      onRefresh: () async {
        ref.read(teacherProvider.notifier).loadTeachers(refresh: true);
      },
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: state.teachers.length + (state.hasMore ? 1 : 0),
        itemBuilder: (context, index) {
          if (index == state.teachers.length) {
            ref.read(teacherProvider.notifier).loadTeachers();
            return const Padding(
              padding: EdgeInsets.all(16),
              child: Center(child: CircularProgressIndicator()),
            );
          }
          final teacher = state.teachers[index];
          return _buildTeacherCard(teacher, isDark);
        },
      ),
    );
  }

  Widget _buildTeacherCard(dynamic teacher, bool isDark) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                child: Text(
                  teacher.name.isNotEmpty
                      ? teacher.name.substring(0, 1).toUpperCase()
                      : '?',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      teacher.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 15,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      teacher.departmentName ?? teacher.qualification ?? 'Teacher',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.grey[600],
                      ),
                    ),
                    if (teacher.experience != null)
                      Text(
                        '${teacher.experience} years experience',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[500],
                        ),
                      ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: teacher.status == 'ACTIVE'
                      ? AppColors.success.withValues(alpha: 0.1)
                      : Colors.grey.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  teacher.status == 'ACTIVE' ? 'Active' : 'Inactive',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: teacher.status == 'ACTIVE'
                        ? AppColors.success
                        : Colors.grey,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
