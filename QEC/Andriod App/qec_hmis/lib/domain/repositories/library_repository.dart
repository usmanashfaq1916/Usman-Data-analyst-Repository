import 'package:dartz/dartz.dart';
import '../../core/errors/failures.dart';
import '../entities/library.dart';

abstract class LibraryRepository {
  Future<Either<Failure, List<Book>>> getBooks({
    int page = 1,
    String? search,
    String? category,
  });
}
