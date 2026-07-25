import 'package:dartz/dartz.dart';
import '../../core/errors/exceptions.dart';
import '../../core/errors/failures.dart';
import '../../domain/entities/library.dart';
import '../../domain/repositories/library_repository.dart';
import '../datasources/library_remote_datasource.dart';

class LibraryRepositoryImpl implements LibraryRepository {
  final LibraryRemoteDataSource _remoteDataSource;

  LibraryRepositoryImpl(this._remoteDataSource);

  @override
  Future<Either<Failure, List<Book>>> getBooks({
    int page = 1,
    String? search,
    String? category,
  }) async {
    try {
      final models = await _remoteDataSource.getBooks(
        page: page,
        search: search,
        category: category,
      );
      return Right(models.map((m) => m.toEntity()).toList());
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(ServerFailure(message: e.toString()));
    }
  }
}
