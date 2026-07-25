import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/timetable_model.dart';

class TimetableRemoteDataSource {
  final DioClient _dioClient;

  TimetableRemoteDataSource(this._dioClient);

  Future<List<TimetableModel>> getTimetable({
    String? classId,
    String? campusId,
    String? dayOfWeek,
  }) async {
    final response = await _dioClient.get(
      ApiConstants.timetable,
      queryParameters: {
        if (classId != null) 'classId': classId,
        if (campusId != null) 'campusId': campusId,
        if (dayOfWeek != null) 'dayOfWeek': dayOfWeek,
      },
    );
    final data = response.data is List
        ? response.data
        : response.data['timetable'] ?? response.data['data'] ?? [];
    return (data as List).map((e) => TimetableModel.fromJson(e)).toList();
  }
}
