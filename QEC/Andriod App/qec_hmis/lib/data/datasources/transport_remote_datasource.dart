import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/transport_model.dart';

class TransportRemoteDataSource {
  final DioClient _dioClient;

  TransportRemoteDataSource(this._dioClient);

  Future<List<BusRouteModel>> getRoutes({
    String? campusId,
    String? status,
  }) async {
    final response = await _dioClient.get(
      ApiConstants.transport,
      queryParameters: {
        if (campusId != null) 'campusId': campusId,
        if (status != null) 'status': status,
      },
    );
    final data = response.data is List
        ? response.data
        : response.data['routes'] ?? response.data['data'] ?? [];
    return (data as List).map((e) => BusRouteModel.fromJson(e)).toList();
  }
}
