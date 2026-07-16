import 'package:equatable/equatable.dart';

enum FeePaymentStatus { PAID, PENDING, PARTIAL, OVERDUE }

class Fee extends Equatable {
  final String id;
  final String studentId;
  final String? studentName;
  final String? rollNumber;
  final String type;
  final double amount;
  final double paidAmount;
  final FeePaymentStatus status;
  final DateTime? dueDate;
  final DateTime? paidAt;
  final DateTime createdAt;

  const Fee({
    required this.id,
    required this.studentId,
    this.studentName,
    this.rollNumber,
    required this.type,
    required this.amount,
    this.paidAmount = 0,
    this.status = FeePaymentStatus.PENDING,
    this.dueDate,
    this.paidAt,
    required this.createdAt,
  });

  double get remaining => amount - paidAmount;
  bool get isOverdue => status == FeePaymentStatus.OVERDUE;
  bool get isPaid => status == FeePaymentStatus.PAID;

  @override
  List<Object?> get props => [id, studentId, status, amount];
}

class FeeCollection extends Equatable {
  final double totalCollected;
  final double totalPending;
  final double totalOverdue;
  final int paidCount;
  final int pendingCount;

  const FeeCollection({
    this.totalCollected = 0,
    this.totalPending = 0,
    this.totalOverdue = 0,
    this.paidCount = 0,
    this.pendingCount = 0,
  });

  @override
  List<Object?> get props => [totalCollected, totalPending, paidCount, pendingCount];
}
