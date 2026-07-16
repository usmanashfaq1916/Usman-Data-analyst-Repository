import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/fee_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/utils/extensions.dart';
import '../../../domain/entities/fee.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class FeeScreen extends ConsumerStatefulWidget {
  const FeeScreen({super.key});

  @override
  ConsumerState<FeeScreen> createState() => _FeeScreenState();
}

class _FeeScreenState extends ConsumerState<FeeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    Future.microtask(() {
      ref.read(feeProvider.notifier).loadFees();
      ref.read(feeProvider.notifier).loadFeeStats();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(feeProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Fee Management'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'All Fees'),
            Tab(text: 'Pending'),
            Tab(text: 'Paid'),
          ],
        ),
      ),
      body: Column(
        children: [
          if (state.collection != null)
            _buildCollectionSummary(state.collection!, isDark),
          Expanded(
            child: state.isLoading
                ? const LoadingWidget()
                : state.error != null
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () =>
                            ref.read(feeProvider.notifier).loadFees(),
                      )
                    : state.fees.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No fee records',
                            icon: Icons.payments_outlined,
                          )
                        : TabBarView(
                            controller: _tabController,
                            children: [
                              _buildFeeList(state.fees, isDark),
                              _buildFeeList(
                                state.fees
                                    .where((f) => f.status != FeePaymentStatus.PAID)
                                    .toList(),
                                isDark,
                              ),
                              _buildFeeList(
                                state.fees
                                    .where((f) => f.status == FeePaymentStatus.PAID)
                                    .toList(),
                                isDark,
                              ),
                            ],
                          ),
          ),
        ],
      ),
    );
  }

  Widget _buildCollectionSummary(dynamic collection, bool isDark) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [AppColors.primary, AppColors.primaryLight],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _summaryItem(
            'Collected',
            collection.totalCollected.currency,
            Icons.arrow_upward,
          ),
          _summaryItem(
            'Pending',
            collection.totalPending.currency,
            Icons.arrow_downward,
          ),
          _summaryItem(
            'Overdue',
            collection.totalOverdue.currency,
            Icons.warning,
          ),
        ],
      ),
    );
  }

  Widget _summaryItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: Colors.white.withValues(alpha: 0.8), size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 14,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            color: Colors.white.withValues(alpha: 0.7),
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  Widget _buildFeeList(List fees, bool isDark) {
    if (fees.isEmpty) {
      return const Center(
        child: Text('No records found'),
      );
    }
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      itemCount: fees.length,
      itemBuilder: (context, index) {
        final fee = fees[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: InkWell(
            onTap: () => _showFeeDetails(context, fee),
            borderRadius: BorderRadius.circular(12),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: _getStatusColor(fee.status).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      Icons.receipt_long,
                      color: _getStatusColor(fee.status),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          fee.type,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          fee.studentName ?? 'Student',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        fee.amount.currency,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 14,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 6, vertical: 2),
                        margin: const EdgeInsets.only(top: 4),
                        decoration: BoxDecoration(
                          color: _getStatusColor(fee.status)
                              .withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          fee.status.name,
                          style: TextStyle(
                            fontSize: 10,
                            color: _getStatusColor(fee.status),
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Color _getStatusColor(FeePaymentStatus status) {
    switch (status) {
      case FeePaymentStatus.PAID:
        return AppColors.success;
      case FeePaymentStatus.PENDING:
        return AppColors.warning;
      case FeePaymentStatus.PARTIAL:
        return AppColors.info;
      case FeePaymentStatus.OVERDUE:
        return AppColors.error;
    }
  }

  void _showFeeDetails(BuildContext context, dynamic fee) {
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
              fee.type,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            _detailRow('Amount', fee.amount.currency),
            _detailRow('Paid', fee.paidAmount.currency),
            _detailRow('Remaining', fee.remaining.currency),
            _detailRow('Status', fee.status.name),
            if (fee.dueDate != null)
              _detailRow('Due Date', fee.dueDate!.formattedDate),
            const SizedBox(height: 20),
            if (fee.status != FeePaymentStatus.PAID)
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => _collectPayment(context, fee),
                  icon: const Icon(Icons.payments),
                  label: const Text('Collect Payment'),
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

  void _collectPayment(BuildContext context, dynamic fee) {
    final amountController = TextEditingController(text: fee.remaining.toString());
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Collect Payment'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: amountController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                labelText: 'Amount',
                prefixText: 'Rs. ',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final amount = double.tryParse(amountController.text);
              if (amount != null && amount > 0) {
                ref.read(feeProvider.notifier).collectFee(
                      fee.id,
                      amount,
                      'CASH',
                    );
                Navigator.pop(context);
              }
            },
            child: const Text('Collect'),
          ),
        ],
      ),
    );
  }
}
