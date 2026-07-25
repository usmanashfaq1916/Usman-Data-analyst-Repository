import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/library_model.dart';

class LibraryRemoteDataSource {
  final DioClient _dioClient;

  LibraryRemoteDataSource(this._dioClient);

  Future<List<BookModel>> getBooks({
    int page = 1,
    String? search,
    String? category,
  }) async {
    final response = await _dioClient.get(
      ApiConstants.library,
      queryParameters: {
        'page': page,
        if (search != null) 'search': search,
        if (category != null) 'category': category,
      },
    );
    final data = response.data is List
        ? response.data
        : response.data['books'] ?? response.data['data'] ?? [];
    return (data as List).map((e) => BookModel.fromJson(e)).toList();
  }
}
