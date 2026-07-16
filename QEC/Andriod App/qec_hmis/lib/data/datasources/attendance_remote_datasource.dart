import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/attendance_model.dart';
import '../../core/constants/api_constants.dart';

class AttendanceRemoteDataSource {
  final DioClient _client;

  AttendanceRemoteDataSource(this._client);

  Future<List<AttendanceModel>> getAttendance({
    required DateTime date,
    String? classId,
    String? courseId,
  }) async {
    final params = <String, dynamic>{
      'date': _formatDate(date),
      if (classId != null) 'classId': classId,
      if (courseId != null) 'courseId': courseId,
    };
    final response = await _client.get(ApiConstants.attendance, queryParameters: params);
    if (response.statusCode == 200) {
      final List data = response.data['attendance'] ?? response.data['data'] ?? [];
      return data.map((json) => AttendanceModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch attendance');
  }

  Future<void> markAttendance(AttendanceModel attendance) async {
    final response = await _client.post(
      ApiConstants.attendance,
      data: attendance.toJson(),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw ServerException(message: 'Failed to mark attendance');
    }
  }

  Future<void> markBulkAttendance(List<AttendanceModel> attendanceList) async {
    final response = await _client.post(
      ApiConstants.attendanceBulk,
      data: {'attendance': attendanceList.map((a) => a.toJson()).toList()},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw ServerException(message: 'Failed to mark attendance');
    }
  }

  Future<AttendanceStatsModel> getAttendanceStats({
    required DateTime startDate,
    required DateTime endDate,
    String? classId,
    String? studentId,
  }) async {
    final params = <String, dynamic>{
      'startDate': _formatDate(startDate),
      'endDate': _formatDate(endDate),
      if (classId != null) 'classId': classId,
      if (studentId != null) 'studentId': studentId,
    };
    final response = await _client.get(
      ApiConstants.attendanceReport,
      queryParameters: params,
    );
    if (response.statusCode == 200) {
      return AttendanceStatsModel.fromJson(response.data['stats'] ?? response.data);
    }
    throw ServerException(message: 'Failed to get attendance stats');
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }
}
