import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/fee_model.dart';
import '../../core/constants/api_constants.dart';

class FeeRemoteDataSource {
  final DioClient _client;

  FeeRemoteDataSource(this._client);

  Future<List<FeeModel>> getFees({
    int page = 1,
    String? studentId,
    String? status,
    String? type,
  }) async {
    final params = <String, dynamic>{
      'page': page,
      if (studentId != null) 'studentId': studentId,
      if (status != null) 'status': status,
      if (type != null) 'type': type,
    };
    final response = await _client.get(ApiConstants.fees, queryParameters: params);
    if (response.statusCode == 200) {
      final List data = response.data['fees'] ?? response.data['data'] ?? [];
      return data.map((json) => FeeModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch fees');
  }

  Future<FeeModel> collectFee(String feeId, double amount, String paymentMethod) async {
    final response = await _client.post(
      '${ApiConstants.fees}/$feeId/collect',
      data: {'amount': amount, 'paymentMethod': paymentMethod},
    );
    if (response.statusCode == 200) {
      return FeeModel.fromJson(response.data['fee'] ?? response.data);
    }
    throw ServerException(message: 'Failed to collect fee');
  }

  Future<FeeCollectionModel> getFeeCollectionStats({
    DateTime? startDate,
    DateTime? endDate,
    String? campusId,
  }) async {
    final params = <String, dynamic>{
      if (startDate != null) 'startDate': startDate.toIso8601String(),
      if (endDate != null) 'endDate': endDate.toIso8601String(),
      if (campusId != null) 'campusId': campusId,
    };
    final response = await _client.get(
      ApiConstants.feeReport,
      queryParameters: params,
    );
    if (response.statusCode == 200) {
      return FeeCollectionModel.fromJson(response.data['stats'] ?? response.data);
    }
    throw ServerException(message: 'Failed to get fee stats');
  }

  Future<List<FeeModel>> getStudentFees(String studentId) async {
    return getFees(studentId: studentId);
  }
}
