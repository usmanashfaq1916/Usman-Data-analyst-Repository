import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/student_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class StudentListScreen extends ConsumerStatefulWidget {
  const StudentListScreen({super.key});

  @override
  ConsumerState<StudentListScreen> createState() => _StudentListScreenState();
}

class _StudentListScreenState extends ConsumerState<StudentListScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(studentProvider.notifier).loadStudents();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(studentProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Students'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddStudentDialog(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name or roll number...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(studentProvider.notifier).searchStudents('');
                        },
                      )
                    : null,
              ),
              onChanged: (value) {
                ref.read(studentProvider.notifier).searchStudents(value);
              },
            ),
          ),
          Expanded(
            child: state.isLoading && state.students.isEmpty
                ? const ShimmerLoading()
                : state.error != null && state.students.isEmpty
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () =>
                            ref.read(studentProvider.notifier).loadStudents(),
                      )
                    : state.students.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No students found',
                            icon: Icons.people_outline,
                          )
                        : RefreshIndicator(
                            onRefresh: () => ref
                                .read(studentProvider.notifier)
                                .loadStudents(refresh: true),
                            child: ListView.builder(
                              itemCount: state.students.length + 1,
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemBuilder: (context, index) {
                                if (index == state.students.length) {
                                  if (state.hasMore) {
                                    ref
                                        .read(studentProvider.notifier)
                                        .loadStudents();
                                    return const Padding(
                                      padding: EdgeInsets.all(16),
                                      child: Center(
                                          child: CircularProgressIndicator()),
                                    );
                                  }
                                  return const SizedBox();
                                }
                                final student = state.students[index];
                                return _buildStudentCard(student, isDark);
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentCard(dynamic student, bool isDark) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => context.go('/students/${student.id}'),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                child: Text(
                  student.rollNumber.isNotEmpty
                      ? student.rollNumber.substring(
                          student.rollNumber.length > 2
                              ? student.rollNumber.length - 2
                              : 0)
                      : '?',
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Student #${student.rollNumber}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      student.departmentName ?? 'No Department',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: student.status == 'ACTIVE'
                      ? AppColors.success.withValues(alpha: 0.1)
                      : AppColors.warning.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  student.status,
                  style: TextStyle(
                    fontSize: 11,
                    color: student.status == 'ACTIVE'
                        ? AppColors.success
                        : AppColors.warning,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        ),
      ),
    );
  }

  void _showAddStudentDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => const _AddStudentForm(),
    );
  }
}

class _AddStudentForm extends ConsumerStatefulWidget {
  const _AddStudentForm();

  @override
  ConsumerState<_AddStudentForm> createState() => _AddStudentFormState();
}

class _AddStudentFormState extends ConsumerState<_AddStudentForm> {
  final _formKey = GlobalKey<FormState>();
  final _rollNoController = TextEditingController();

  @override
  void dispose() {
    _rollNoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 24,
        right: 24,
        top: 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Add New Student',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _rollNoController,
              decoration: const InputDecoration(
                labelText: 'Roll Number',
                prefixIcon: Icon(Icons.numbers),
              ),
              validator: (v) =>
                  v?.isEmpty ?? true ? 'Roll number is required' : null,
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState!.validate()) {
                    Navigator.pop(context);
                  }
                },
                child: const Text('Create Student'),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
