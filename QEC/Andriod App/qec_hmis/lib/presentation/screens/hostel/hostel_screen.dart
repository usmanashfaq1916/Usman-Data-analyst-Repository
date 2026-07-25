import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/hostel_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class HostelScreen extends ConsumerStatefulWidget {
  const HostelScreen({super.key});

  @override
  ConsumerState<HostelScreen> createState() => _HostelScreenState();
}

class _HostelScreenState extends ConsumerState<HostelScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(hostelProvider.notifier).loadHostels();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(hostelProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Hostel'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(hostelProvider.notifier).loadHostels(),
          ),
        ],
      ),
      body: state.isLoading
          ? const LoadingWidget()
          : state.error != null
              ? AppErrorWidget(
                  message: state.error!,
                  onRetry: () => ref.read(hostelProvider.notifier).loadHostels(),
                )
              : state.hostels.isEmpty
                  ? const EmptyStateWidget(
                      message: 'No hostels available',
                      icon: Icons.business,
                    )
                  : RefreshIndicator(
                      onRefresh: () => ref.read(hostelProvider.notifier).loadHostels(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: state.hostels.length,
                        itemBuilder: (context, index) {
                          final hostel = state.hostels[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 16),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: AppColors.primary.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(Icons.business, color: AppColors.primary),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              hostel.name,
                                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                                            ),
                                            if (hostel.wardenName != null)
                                              Text(
                                                'Warden: ${hostel.wardenName}',
                                                style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                                              ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      _statItem('Rooms', '${hostel.occupiedRooms}/${hostel.totalRooms}', Icons.meeting_room),
                                      const SizedBox(width: 24),
                                      _statItem('Beds', '${hostel.occupiedBeds}/${hostel.totalBeds}', Icons.bed),
                                      const SizedBox(width: 24),
                                      _statItem('Occupancy', '${hostel.occupancyRate.toStringAsFixed(0)}%', Icons.pie_chart),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(4),
                                    child: LinearProgressIndicator(
                                      value: hostel.totalBeds > 0 ? hostel.occupiedBeds / hostel.totalBeds : 0,
                                      backgroundColor: Colors.grey[300],
                                      color: hostel.occupancyRate > 80
                                          ? AppColors.error
                                          : hostel.occupancyRate > 50
                                              ? AppColors.warning
                                              : AppColors.success,
                                      minHeight: 6,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
                    ),
    );
  }

  Widget _statItem(String label, String value, IconData icon) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(height: 4),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          Text(label, style: TextStyle(fontSize: 11, color: Colors.grey[600])),
        ],
      ),
    );
  }
}
