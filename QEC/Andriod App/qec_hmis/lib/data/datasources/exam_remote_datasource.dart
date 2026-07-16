import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/exam_model.dart';
import '../../core/constants/api_constants.dart';

class ExamRemoteDataSource {
  final DioClient _client;

  ExamRemoteDataSource(this._client);

  Future<List<ExamModel>> getExams({
    String? courseId,
    String? classId,
    bool? upcoming,
  }) async {
    final params = <String, dynamic>{
      if (courseId != null) 'courseId': courseId,
      if (classId != null) 'classId': classId,
      if (upcoming != null) 'upcoming': upcoming,
    };
    final response = await _client.get(ApiConstants.exams, queryParameters: params);
    if (response.statusCode == 200) {
      final List data = response.data['exams'] ?? response.data['data'] ?? [];
      return data.map((json) => ExamModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch exams');
  }

  Future<ExamModel> getExam(String id) async {
    final response = await _client.get('${ApiConstants.exams}/$id');
    if (response.statusCode == 200) {
      return ExamModel.fromJson(response.data['exam'] ?? response.data);
    }
    throw ServerException(message: 'Exam not found');
  }

  Future<ExamModel> createExam(ExamModel exam) async {
    final response = await _client.post(ApiConstants.exams, data: exam.toJson());
    if (response.statusCode == 201 || response.statusCode == 200) {
      return ExamModel.fromJson(response.data['exam'] ?? response.data);
    }
    throw ServerException(message: 'Failed to create exam');
  }

  Future<List<ExamResultModel>> getExamResults(String examId) async {
    final response = await _client.get(
      '${ApiConstants.examResults}/$examId',
    );
    if (response.statusCode == 200) {
      final List data = response.data['results'] ?? response.data['data'] ?? [];
      return data.map((json) => ExamResultModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch exam results');
  }

  Future<void> submitMarks(List<ExamResultModel> results) async {
    final response = await _client.post(
      ApiConstants.examMarks,
      data: {'results': results.map((r) => r.toJson()).toList()},
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw ServerException(message: 'Failed to submit marks');
    }
  }

  Future<void> publishResults(String examId) async {
    final response = await _client.post(
      '${ApiConstants.exams}/$examId/publish',
    );
    if (response.statusCode != 200) {
      throw ServerException(message: 'Failed to publish results');
    }
  }
}
