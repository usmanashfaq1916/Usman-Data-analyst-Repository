import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/student_model.dart';
import '../../core/constants/api_constants.dart';

class StudentRemoteDataSource {
  final DioClient _client;

  StudentRemoteDataSource(this._client);

  Future<List<StudentModel>> getStudents({
    int page = 1,
    int limit = 20,
    String? search,
    String? campusId,
    String? departmentId,
    String? status,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      'limit': limit,
      if (search != null) 'search': search,
      if (campusId != null) 'campusId': campusId,
      if (departmentId != null) 'departmentId': departmentId,
      if (status != null) 'status': status,
    };
    final response = await _client.get(ApiConstants.students, queryParameters: params);
    if (response.statusCode == 200) {
      final List data = response.data['students'] ?? response.data['data'] ?? [];
      return data.map((json) => StudentModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch students');
  }

  Future<StudentModel> getStudent(String id) async {
    final response = await _client.get('${ApiConstants.students}/$id');
    if (response.statusCode == 200) {
      return StudentModel.fromJson(response.data['student'] ?? response.data);
    }
    throw ServerException(message: 'Student not found');
  }

  Future<StudentModel> createStudent(StudentModel student) async {
    final response = await _client.post(
      ApiConstants.students,
      data: student.toJson(),
    );
    if (response.statusCode == 201 || response.statusCode == 200) {
      return StudentModel.fromJson(response.data['student'] ?? response.data);
    }
    throw ServerException(message: 'Failed to create student');
  }

  Future<StudentModel> updateStudent(StudentModel student) async {
    final response = await _client.put(
      '${ApiConstants.students}/${student.id}',
      data: student.toJson(),
    );
    if (response.statusCode == 200) {
      return StudentModel.fromJson(response.data['student'] ?? response.data);
    }
    throw ServerException(message: 'Failed to update student');
  }

  Future<void> deleteStudent(String id) async {
    final response = await _client.delete('${ApiConstants.students}/$id');
    if (response.statusCode != 200 && response.statusCode != 204) {
      throw ServerException(message: 'Failed to delete student');
    }
  }

  Future<String> generateQrCode(String studentId) async {
    final response = await _client.post(
      '${ApiConstants.students}/$studentId/qr',
    );
    if (response.statusCode == 200) {
      return response.data['qrCode'] ?? response.data['url'] ?? '';
    }
    throw ServerException(message: 'Failed to generate QR code');
  }
}
