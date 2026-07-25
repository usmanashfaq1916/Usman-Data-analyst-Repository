import '../../core/constants/api_constants.dart';
import '../../core/network/dio_client.dart';
import '../models/hostel_model.dart';

class HostelRemoteDataSource {
  final DioClient _dioClient;

  HostelRemoteDataSource(this._dioClient);

  Future<List<HostelModel>> getHostels({String? campusId}) async {
    final response = await _dioClient.get(
      ApiConstants.hostel,
      queryParameters: {
        if (campusId != null) 'campusId': campusId,
      },
    );
    final data = response.data is List
        ? response.data
        : response.data['hostels'] ?? response.data['data'] ?? [];
    return (data as List).map((e) => HostelModel.fromJson(e)).toList();
  }
}
