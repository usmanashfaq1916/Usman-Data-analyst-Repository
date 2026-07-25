import 'package:equatable/equatable.dart';

class Hostel extends Equatable {
  final String id;
  final String name;
  final String? wardenName;
  final String? wardenPhone;
  final String? campusId;
  final String? campusName;
  final int totalRooms;
  final int occupiedRooms;
  final int totalBeds;
  final int occupiedBeds;
  final String? address;
  final String status;

  const Hostel({
    required this.id,
    required this.name,
    this.wardenName,
    this.wardenPhone,
    this.campusId,
    this.campusName,
    this.totalRooms = 0,
    this.occupiedRooms = 0,
    this.totalBeds = 0,
    this.occupiedBeds = 0,
    this.address,
    this.status = 'ACTIVE',
  });

  int get availableBeds => totalBeds - occupiedBeds;
  bool get isFull => occupiedBeds >= totalBeds;
  double get occupancyRate => totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;

  @override
  List<Object?> get props => [id, name, status];
}

class Room extends Equatable {
  final String id;
  final String hostelId;
  final String roomNumber;
  final String type;
  final int totalBeds;
  final int occupiedBeds;
  final double? monthlyFee;
  final String status;

  const Room({
    required this.id,
    required this.hostelId,
    required this.roomNumber,
    this.type = 'SHARED',
    this.totalBeds = 4,
    this.occupiedBeds = 0,
    this.monthlyFee,
    this.status = 'AVAILABLE',
  });

  int get availableBeds => totalBeds - occupiedBeds;
  bool get isFull => occupiedBeds >= totalBeds;

  @override
  List<Object?> get props => [id, hostelId, roomNumber];
}

class HostelAllocation extends Equatable {
  final String id;
  final String roomId;
  final String studentId;
  final String? studentName;
  final DateTime fromDate;
  final DateTime? toDate;
  final String status;

  const HostelAllocation({
    required this.id,
    required this.roomId,
    required this.studentId,
    this.studentName,
    required this.fromDate,
    this.toDate,
    this.status = 'ACTIVE',
  });

  @override
  List<Object?> get props => [id, roomId, studentId, status];
}
