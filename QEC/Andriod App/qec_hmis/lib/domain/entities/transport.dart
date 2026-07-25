import 'package:equatable/equatable.dart';

class BusRoute extends Equatable {
  final String id;
  final String routeName;
  final String? vehicleNumber;
  final String? driverName;
  final String? driverPhone;
  final int capacity;
  final int occupied;
  final List<String> stops;
  final String? campusId;
  final String? campusName;
  final String status;

  const BusRoute({
    required this.id,
    required this.routeName,
    this.vehicleNumber,
    this.driverName,
    this.driverPhone,
    this.capacity = 40,
    this.occupied = 0,
    this.stops = const [],
    this.campusId,
    this.campusName,
    this.status = 'ACTIVE',
  });

  int get availableSeats => capacity - occupied;
  bool get isFull => occupied >= capacity;

  @override
  List<Object?> get props => [id, routeName, vehicleNumber];
}
