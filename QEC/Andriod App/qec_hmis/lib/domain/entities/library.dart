import 'package:equatable/equatable.dart';

class Book extends Equatable {
  final String id;
  final String title;
  final String? author;
  final String? isbn;
  final String? category;
  final int totalCopies;
  final int availableCopies;
  final String? publisher;
  final int? publishYear;
  final String? location;
  final String status;

  const Book({
    required this.id,
    required this.title,
    this.author,
    this.isbn,
    this.category,
    this.totalCopies = 1,
    this.availableCopies = 1,
    this.publisher,
    this.publishYear,
    this.location,
    this.status = 'AVAILABLE',
  });

  bool get isAvailable => availableCopies > 0;

  @override
  List<Object?> get props => [id, isbn, title];
}

class BookIssue extends Equatable {
  final String id;
  final String bookId;
  final String? bookTitle;
  final String studentId;
  final String? studentName;
  final DateTime issueDate;
  final DateTime? dueDate;
  final DateTime? returnDate;
  final String status;

  const BookIssue({
    required this.id,
    required this.bookId,
    this.bookTitle,
    required this.studentId,
    this.studentName,
    required this.issueDate,
    this.dueDate,
    this.returnDate,
    this.status = 'ISSUED',
  });

  bool get isOverdue {
    if (returnDate != null) return false;
    if (dueDate == null) return false;
    return DateTime.now().isAfter(dueDate!);
  }

  @override
  List<Object?> get props => [id, bookId, studentId, status];
}
