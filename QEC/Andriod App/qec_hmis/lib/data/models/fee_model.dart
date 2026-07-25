import '../../domain/entities/fee.dart';

class FeeModel {
  final String id;
  final String studentId;
  final String? studentName;
  final String? rollNumber;
  final String type;
  final double amount;
  final double paidAmount;
  final String status;
  final String? dueDate;
  final String? paidAt;
  final String createdAt;

  const FeeModel({
    required this.id,
    required this.studentId,
    this.studentName,
    this.rollNumber,
    required this.type,
    required this.amount,
    this.paidAmount = 0,
    this.status = 'PENDING',
    this.dueDate,
    this.paidAt,
    required this.createdAt,
  });

  factory FeeModel.fromJson(Map<String, dynamic> json) {
    return FeeModel(
      id: json['id'] as String? ?? '',
      studentId: json['studentId'] as String? ?? '',
      studentName: json['studentName'] as String?,
      rollNumber: json['rollNumber'] as String?,
      type: json['type'] as String? ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0,
      paidAmount: (json['paidAmount'] as num?)?.toDouble() ?? 0,
      status: json['status'] as String? ?? 'PENDING',
      dueDate: json['dueDate'] as String?,
      paidAt: json['paidAt'] as String?,
      createdAt: json['createdAt'] as String? ?? DateTime.now().toIso8601String(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'studentId': studentId,
    'studentName': studentName,
    'rollNumber': rollNumber,
    'type': type,
    'amount': amount,
    'paidAmount': paidAmount,
    'status': status,
    'dueDate': dueDate,
    'paidAt': paidAt,
    'createdAt': createdAt,
  };

  Fee toEntity() {
    return Fee(
      id: id,
      studentId: studentId,
      studentName: studentName,
      rollNumber: rollNumber,
      type: type,
      amount: amount,
      paidAmount: paidAmount,
      status: FeePaymentStatus.values.firstWhere(
        (s) => s.name == status,
        orElse: () => FeePaymentStatus.PENDING,
      ),
      dueDate: dueDate != null ? DateTime.parse(dueDate!) : null,
      paidAt: paidAt != null ? DateTime.parse(paidAt!) : null,
      createdAt: DateTime.parse(createdAt),
    );
  }
}

class FeeCollectionModel {
  final double totalCollected;
  final double totalPending;
  final double totalOverdue;
  final int paidCount;
  final int pendingCount;

  const FeeCollectionModel({
    this.totalCollected = 0,
    this.totalPending = 0,
    this.totalOverdue = 0,
    this.paidCount = 0,
    this.pendingCount = 0,
  });

  factory FeeCollectionModel.fromJson(Map<String, dynamic> json) {
    return FeeCollectionModel(
      totalCollected: (json['totalCollected'] as num?)?.toDouble() ?? 0,
      totalPending: (json['totalPending'] as num?)?.toDouble() ?? 0,
      totalOverdue: (json['totalOverdue'] as num?)?.toDouble() ?? 0,
      paidCount: json['paidCount'] as int? ?? 0,
      pendingCount: json['pendingCount'] as int? ?? 0,
    );
  }

  FeeCollection toEntity() {
    return FeeCollection(
      totalCollected: totalCollected,
      totalPending: totalPending,
      totalOverdue: totalOverdue,
      paidCount: paidCount,
      pendingCount: pendingCount,
    );
  }
}
