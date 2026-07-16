import 'package:json_annotation/json_annotation.dart';
import '../../domain/entities/fee.dart';

part 'fee_model.g.dart';

@JsonSerializable()
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

  factory FeeModel.fromJson(Map<String, dynamic> json) => _$FeeModelFromJson(json);
  Map<String, dynamic> toJson() => _$FeeModelToJson(this);

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

@JsonSerializable()
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

  factory FeeCollectionModel.fromJson(Map<String, dynamic> json) =>
      _$FeeCollectionModelFromJson(json);

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
