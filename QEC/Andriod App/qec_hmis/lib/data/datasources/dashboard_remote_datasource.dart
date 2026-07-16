import '../../core/errors/exceptions.dart';
import '../../core/network/dio_client.dart';
import '../models/dashboard_stats_model.dart';
import '../../core/constants/api_constants.dart';

class DashboardRemoteDataSource {
  final DioClient _client;

  DashboardRemoteDataSource(this._client);

  Future<DashboardStatsModel> getStats() async {
    final response = await _client.get(ApiConstants.dashboardStats);
    if (response.statusCode == 200) {
      return DashboardStatsModel.fromJson(
        response.data['stats'] ?? response.data,
      );
    }
    throw ServerException(message: 'Failed to fetch dashboard stats');
  }

  Future<List<CampusStatsModel>> getCampusStats() async {
    final response = await _client.get('${ApiConstants.dashboard}/campus-stats');
    if (response.statusCode == 200) {
      final List data = response.data['campuses'] ?? response.data['data'] ?? [];
      return data.map((json) => CampusStatsModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch campus stats');
  }

  Future<List<ChartDataModel>> getStudentGrowthChart({int months = 6}) async {
    final response = await _client.get(
      '${ApiConstants.dashboardChart}/student-growth',
      queryParameters: {'months': months},
    );
    if (response.statusCode == 200) {
      final List data = response.data['data'] ?? response.data['chart'] ?? [];
      return data.map((json) => ChartDataModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch chart data');
  }

  Future<List<ChartDataModel>> getFeeCollectionChart({int months = 6}) async {
    final response = await _client.get(
      '${ApiConstants.dashboardChart}/fee-collection',
      queryParameters: {'months': months},
    );
    if (response.statusCode == 200) {
      final List data = response.data['data'] ?? response.data['chart'] ?? [];
      return data.map((json) => ChartDataModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch chart data');
  }

  Future<List<ChartDataModel>> getAttendanceChart({int days = 30}) async {
    final response = await _client.get(
      '${ApiConstants.dashboardChart}/attendance',
      queryParameters: {'days': days},
    );
    if (response.statusCode == 200) {
      final List data = response.data['data'] ?? response.data['chart'] ?? [];
      return data.map((json) => ChartDataModel.fromJson(json)).toList();
    }
    throw ServerException(message: 'Failed to fetch chart data');
  }
}
