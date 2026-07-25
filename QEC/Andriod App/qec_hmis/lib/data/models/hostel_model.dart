import '../../domain/entities/hostel.dart';

class HostelModel {
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

  const HostelModel({
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

  factory HostelModel.fromJson(Map<String, dynamic> json) {
    return HostelModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      wardenName: json['wardenName'] as String?,
      wardenPhone: json['wardenPhone'] as String?,
      campusId: json['campusId'] as String?,
      campusName: json['campusName'] as String?,
      totalRooms: json['totalRooms'] as int? ?? 0,
      occupiedRooms: json['occupiedRooms'] as int? ?? 0,
      totalBeds: json['totalBeds'] as int? ?? 0,
      occupiedBeds: json['occupiedBeds'] as int? ?? 0,
      address: json['address'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'wardenName': wardenName,
    'wardenPhone': wardenPhone,
    'campusId': campusId,
    'campusName': campusName,
    'totalRooms': totalRooms,
    'occupiedRooms': occupiedRooms,
    'totalBeds': totalBeds,
    'occupiedBeds': occupiedBeds,
    'address': address,
    'status': status,
  };

  Hostel toEntity() {
    return Hostel(
      id: id,
      name: name,
      wardenName: wardenName,
      wardenPhone: wardenPhone,
      campusId: campusId,
      campusName: campusName,
      totalRooms: totalRooms,
      occupiedRooms: occupiedRooms,
      totalBeds: totalBeds,
      occupiedBeds: occupiedBeds,
      address: address,
      status: status,
    );
  }
}

class RoomModel {
  final String id;
  final String hostelId;
  final String roomNumber;
  final String type;
  final int totalBeds;
  final int occupiedBeds;
  final double? monthlyFee;
  final String status;

  const RoomModel({
    required this.id,
    required this.hostelId,
    required this.roomNumber,
    this.type = 'SHARED',
    this.totalBeds = 4,
    this.occupiedBeds = 0,
    this.monthlyFee,
    this.status = 'AVAILABLE',
  });

  factory RoomModel.fromJson(Map<String, dynamic> json) {
    return RoomModel(
      id: json['id'] as String? ?? '',
      hostelId: json['hostelId'] as String? ?? '',
      roomNumber: json['roomNumber'] as String? ?? '',
      type: json['type'] as String? ?? 'SHARED',
      totalBeds: json['totalBeds'] as int? ?? 4,
      occupiedBeds: json['occupiedBeds'] as int? ?? 0,
      monthlyFee: (json['monthlyFee'] as num?)?.toDouble(),
      status: json['status'] as String? ?? 'AVAILABLE',
    );
  }

  Room toEntity() {
    return Room(
      id: id,
      hostelId: hostelId,
      roomNumber: roomNumber,
      type: type,
      totalBeds: totalBeds,
      occupiedBeds: occupiedBeds,
      monthlyFee: monthlyFee,
      status: status,
    );
  }
}
