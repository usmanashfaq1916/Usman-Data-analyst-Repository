import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/teacher_model.dart';

class TeacherRemoteDataSource {
  final DioClient _dioClient;

  TeacherRemoteDataSource(this._dioClient);

  Future<List<TeacherModel>> getTeachers({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
  }) async {
    final response = await _dioClient.get(
      ApiConstants.teachers,
      queryParameters: {
        'page': page,
        'limit': limit,
        if (search != null) 'search': search,
        if (campusId != null) 'campusId': campusId,
        if (departmentId != null) 'departmentId': departmentId,
      },
    );
    final data = response.data is List
        ? response.data
        : response.data['teachers'] ?? response.data['data'] ?? [];
    return (data as List).map((e) => TeacherModel.fromJson(e)).toList();
  }

  Future<TeacherModel> getTeacher(String id) async {
    final response = await _dioClient.get('${ApiConstants.teachers}/$id');
    final data = response.data['teacher'] ?? response.data;
    return TeacherModel.fromJson(data);
  }
}
