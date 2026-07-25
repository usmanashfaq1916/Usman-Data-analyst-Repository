import '../../domain/entities/library.dart';

class BookModel {
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

  const BookModel({
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

  factory BookModel.fromJson(Map<String, dynamic> json) {
    return BookModel(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      author: json['author'] as String?,
      isbn: json['isbn'] as String?,
      category: json['category'] as String?,
      totalCopies: json['totalCopies'] as int? ?? 1,
      availableCopies: json['availableCopies'] as int? ?? 1,
      publisher: json['publisher'] as String?,
      publishYear: json['publishYear'] as int?,
      location: json['location'] as String?,
      status: json['status'] as String? ?? 'AVAILABLE',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'author': author,
    'isbn': isbn,
    'category': category,
    'totalCopies': totalCopies,
    'availableCopies': availableCopies,
    'publisher': publisher,
    'publishYear': publishYear,
    'location': location,
    'status': status,
  };

  Book toEntity() {
    return Book(
      id: id,
      title: title,
      author: author,
      isbn: isbn,
      category: category,
      totalCopies: totalCopies,
      availableCopies: availableCopies,
      publisher: publisher,
      publishYear: publishYear,
      location: location,
      status: status,
    );
  }
}
