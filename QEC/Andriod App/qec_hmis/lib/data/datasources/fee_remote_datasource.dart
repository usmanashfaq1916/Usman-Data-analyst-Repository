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

  Future<FeeModel> getFee(String id) async {
    final response = await _client.get('${ApiConstants.fees}/$id');
    if (response.statusCode == 200) {
      return FeeModel.fromJson(response.data['fee'] ?? response.data);
    }
    throw ServerException(message: 'Fee not found');
  }

  Future<FeeModel> createFee(FeeModel fee) async {
    final response = await _client.post(ApiConstants.fees, data: fee.toJson());
    if (response.statusCode == 201 || response.statusCode == 200) {
      return FeeModel.fromJson(response.data['fee'] ?? response.data);
    }
    throw ServerException(message: 'Failed to create fee');
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

  Future<String> generateChallan(String feeId) async {
    final response = await _client.post(
      '${ApiConstants.fees}/$feeId/challan',
    );
    if (response.statusCode == 200) {
      return response.data['url'] ?? response.data['challan'] ?? '';
    }
    throw ServerException(message: 'Failed to generate challan');
  }

  Future<void> applyDiscount(String feeId, double discount, String reason) async {
    final response = await _client.post(
      '${ApiConstants.fees}/$feeId/discount',
      data: {'discount': discount, 'reason': reason},
    );
    if (response.statusCode != 200) {
      throw ServerException(message: 'Failed to apply discount');
    }
  }

  Future<void> applyScholarship(String studentId, double percentage) async {
    final response = await _client.post(
      '${ApiConstants.students}/$studentId/scholarship',
      data: {'percentage': percentage},
    );
    if (response.statusCode != 200) {
      throw ServerException(message: 'Failed to apply scholarship');
    }
  }

  Future<List<FeeModel>> getStudentFees(String studentId) async {
    return getFees(studentId: studentId);
  }
}
