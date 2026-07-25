import '../../domain/entities/transport.dart';

class BusRouteModel {
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

  const BusRouteModel({
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

  factory BusRouteModel.fromJson(Map<String, dynamic> json) {
    return BusRouteModel(
      id: json['id'] as String? ?? '',
      routeName: json['routeName'] as String? ?? '',
      vehicleNumber: json['vehicleNumber'] as String?,
      driverName: json['driverName'] as String?,
      driverPhone: json['driverPhone'] as String?,
      capacity: json['capacity'] as int? ?? 40,
      occupied: json['occupied'] as int? ?? 0,
      stops: (json['stops'] as List?)?.map((e) => e as String).toList() ?? [],
      campusId: json['campusId'] as String?,
      campusName: json['campusName'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'routeName': routeName,
    'vehicleNumber': vehicleNumber,
    'driverName': driverName,
    'driverPhone': driverPhone,
    'capacity': capacity,
    'occupied': occupied,
    'stops': stops,
    'campusId': campusId,
    'campusName': campusName,
    'status': status,
  };

  BusRoute toEntity() {
    return BusRoute(
      id: id,
      routeName: routeName,
      vehicleNumber: vehicleNumber,
      driverName: driverName,
      driverPhone: driverPhone,
      capacity: capacity,
      occupied: occupied,
      stops: stops,
      campusId: campusId,
      campusName: campusName,
      status: status,
    );
  }
}
