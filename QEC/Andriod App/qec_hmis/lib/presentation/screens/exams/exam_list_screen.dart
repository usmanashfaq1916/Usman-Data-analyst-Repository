import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../providers/exam_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/extensions.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class ExamListScreen extends ConsumerStatefulWidget {
  const ExamListScreen({super.key});

  @override
  ConsumerState<ExamListScreen> createState() => _ExamListScreenState();
}

class _ExamListScreenState extends ConsumerState<ExamListScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    Future.microtask(() {
      ref.read(examProvider.notifier).loadExams();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(examProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Exams'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All Exams'),
            Tab(text: 'Upcoming'),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showCreateExamDialog(context),
          ),
        ],
      ),
      body: state.isLoading
          ? const LoadingWidget()
          : state.error != null
              ? AppErrorWidget(
                  message: state.error!,
                  onRetry: () =>
                      ref.read(examProvider.notifier).loadExams(),
                )
              : state.exams.isEmpty
                  ? const EmptyStateWidget(
                      message: 'No exams scheduled',
                      icon: Icons.assignment,
                    )
                  : TabBarView(
                      controller: _tabController,
                      children: [
                        _buildExamList(state.exams, isDark),
                        _buildExamList(
                          state.exams
                              .where((e) =>
                                  e.examDate.isAfter(DateTime.now()))
                              .toList(),
                          isDark,
                        ),
                      ],
                    ),
    );
  }

  Widget _buildExamList(List exams, bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: exams.length,
      itemBuilder: (context, index) {
        final exam = exams[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () => _showExamDetails(context, exam),
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          exam.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: exam.isActive
                              ? AppColors.success.withValues(alpha: 0.1)
                              : Colors.grey.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          exam.isActive ? 'Active' : 'Inactive',
                          style: TextStyle(
                            fontSize: 11,
                            color:
                                exam.isActive ? AppColors.success : Colors.grey,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.calendar_today,
                          size: 14, color: Colors.grey),
                      const SizedBox(width: 6),
                      Text(
                        exam.examDate.formattedDate,
                        style: const TextStyle(fontSize: 13),
                      ),
                      const SizedBox(width: 16),
                      const Icon(Icons.grade, size: 14, color: Colors.grey),
                      const SizedBox(width: 6),
                      Text(
                        '${exam.totalMarks} marks',
                        style: const TextStyle(fontSize: 13),
                      ),
                    ],
                  ),
                  if (exam.courseName != null) ...[
                    const SizedBox(height: 4),
                    Text(
                      exam.courseName!,
                      style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  void _showExamDetails(BuildContext context, dynamic exam) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              exam.name,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _detailRow('Type', exam.type),
            _detailRow('Date', exam.examDate.formattedDate),
            _detailRow('Total Marks', '${exam.totalMarks}'),
            _detailRow('Pass Marks', '${exam.passMarks}'),
            if (exam.courseName != null)
              _detailRow('Course', exam.courseName!),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.pop(context);
                  context.go('/exams/${exam.id}/results');
                },
                icon: const Icon(Icons.grade),
                label: const Text('View Results'),
              ),
            ),
            const SizedBox(height: 12),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600])),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }

  void _showCreateExamDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => const _CreateExamDialog(),
    );
  }
}

class _CreateExamDialog extends ConsumerStatefulWidget {
  const _CreateExamDialog();

  @override
  ConsumerState<_CreateExamDialog> createState() => _CreateExamDialogState();
}

class _CreateExamDialogState extends ConsumerState<_CreateExamDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Create New Exam'),
      content: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Exam Name',
              ),
              validator: (v) =>
                  v?.isEmpty ?? true ? 'Name is required' : null,
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () {
            if (_formKey.currentState!.validate()) {
              Navigator.pop(context);
            }
          },
          child: const Text('Create'),
        ),
      ],
    );
  }
}
