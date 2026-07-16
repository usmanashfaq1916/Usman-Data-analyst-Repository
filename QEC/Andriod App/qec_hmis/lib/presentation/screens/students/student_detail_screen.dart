import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../providers/student_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class StudentDetailScreen extends ConsumerStatefulWidget {
  final String studentId;

  const StudentDetailScreen({super.key, required this.studentId});

  @override
  ConsumerState<StudentDetailScreen> createState() =>
      _StudentDetailScreenState();
}

class _StudentDetailScreenState extends ConsumerState<StudentDetailScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(studentProvider.notifier).loadStudent(widget.studentId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(studentProvider);
    final student = state.selectedStudent;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Student Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code),
            onPressed: () => _showQrCode(context, student),
          ),
        ],
      ),
      body: state.isLoading
          ? const LoadingWidget()
          : state.error != null
              ? AppErrorWidget(
                  message: state.error!,
                  onRetry: () => ref
                      .read(studentProvider.notifier)
                      .loadStudent(widget.studentId),
                )
              : student == null
                  ? const AppErrorWidget(message: 'Student not found')
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          _buildProfileHeader(student, isDark),
                          const SizedBox(height: 16),
                          _buildInfoSection('Academic Information', [
                            _infoTile('Roll Number', student.rollNumber),
                            _infoTile('Department', student.departmentName ?? '-'),
                            _infoTile('Program', student.programName ?? '-'),
                            _infoTile('Campus', student.campusName ?? '-'),
                            _infoTile('Status', student.status),
                            _infoTile(
                              'Admission Date',
                              student.admissionDate.formattedDate,
                            ),
                          ]),
                          const SizedBox(height: 12),
                          _buildInfoSection('Personal Information', [
                            _infoTile('CNIC', student.cnic ?? '-'),
                            _infoTile(
                              'Date of Birth',
                              student.dateOfBirth?.formattedDate ?? '-',
                            ),
                            _infoTile('Gender', student.gender ?? '-'),
                            _infoTile('Guardian', student.guardianName ?? '-'),
                            _infoTile('Contact', student.guardianPhone ?? '-'),
                          ]),
                          const SizedBox(height: 16),
                          _buildActionButtons(context, student.id),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildProfileHeader(dynamic student, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryLight],
        ),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          CircleAvatar(
            radius: 40,
            backgroundColor: AppColors.accent,
            child: Text(
              student.rollNumber.isNotEmpty
                  ? student.rollNumber.substring(0, 1)
                  : '?',
              style: const TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
                color: AppColors.primary,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            '#${student.rollNumber}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            student.departmentName ?? 'Student',
            style: TextStyle(
              color: Colors.white.withValues(alpha: 0.8),
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoSection(String title, List<Widget> children) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.darkCard
            : Colors.white,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          ...children,
        ],
      ),
    );
  }

  Widget _infoTile(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 120,
            child: Text(
              label,
              style: TextStyle(
                color: Colors.grey[600],
                fontSize: 13,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context, String studentId) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.swap_horiz),
            label: const Text('Transfer'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: OutlinedButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.arrow_upward),
            label: const Text('Promote'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: ElevatedButton.icon(
            onPressed: () => _showQrCode(context, null),
            icon: const Icon(Icons.qr_code, size: 18),
            label: const Text('QR'),
          ),
        ),
      ],
    );
  }

  void _showQrCode(BuildContext context, dynamic student) {
    if (student == null) return;
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Student ID Card'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            QrImageView(
              data: student.id,
              version: QrVersions.auto,
              size: 200,
              backgroundColor: Colors.white,
            ),
            const SizedBox(height: 12),
            Text('#${student.rollNumber}'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
