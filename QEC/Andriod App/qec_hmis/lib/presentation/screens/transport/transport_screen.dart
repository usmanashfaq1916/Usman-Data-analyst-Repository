import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/transport_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class TransportScreen extends ConsumerStatefulWidget {
  const TransportScreen({super.key});

  @override
  ConsumerState<TransportScreen> createState() => _TransportScreenState();
}

class _TransportScreenState extends ConsumerState<TransportScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(transportProvider.notifier).loadRoutes();
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(transportProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transport'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(transportProvider.notifier).loadRoutes(),
          ),
        ],
      ),
      body: state.isLoading
          ? const LoadingWidget()
          : state.error != null
              ? AppErrorWidget(
                  message: state.error!,
                  onRetry: () => ref.read(transportProvider.notifier).loadRoutes(),
                )
              : state.routes.isEmpty
                  ? const EmptyStateWidget(
                      message: 'No transport routes available',
                      icon: Icons.directions_bus,
                    )
                  : RefreshIndicator(
                      onRefresh: () => ref.read(transportProvider.notifier).loadRoutes(),
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: state.routes.length,
                        itemBuilder: (context, index) {
                          final route = state.routes[index];
                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
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
                                        child: const Icon(Icons.directions_bus, color: AppColors.primary),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              route.routeName,
                                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
                                            ),
                                            if (route.vehicleNumber != null)
                                              Text(
                                                route.vehicleNumber!,
                                                style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                                              ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: route.isFull
                                              ? AppColors.error.withValues(alpha: 0.1)
                                              : AppColors.success.withValues(alpha: 0.1),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          '${route.availableSeats} seats',
                                          style: TextStyle(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: route.isFull ? AppColors.error : AppColors.success,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  if (route.driverName != null)
                                    _infoRow(Icons.person, 'Driver', route.driverName!),
                                  if (route.driverPhone != null)
                                    _infoRow(Icons.phone, 'Contact', route.driverPhone!),
                                  if (route.stops.isNotEmpty)
                                    Padding(
                                      padding: const EdgeInsets.only(top: 8),
                                      child: Wrap(
                                        spacing: 6,
                                        runSpacing: 4,
                                        children: route.stops.map((stop) {
                                          return Chip(
                                            label: Text(stop, style: const TextStyle(fontSize: 11)),
                                            materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                            visualDensity: VisualDensity.compact,
                                          );
                                        }).toList(),
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

  Widget _infoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        children: [
          Icon(icon, size: 14, color: Colors.grey),
          const SizedBox(width: 8),
          Text('$label: ', style: TextStyle(fontSize: 13, color: Colors.grey[600])),
          Text(value, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}
