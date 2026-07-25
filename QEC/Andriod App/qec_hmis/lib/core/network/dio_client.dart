import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../constants/app_constants.dart';

class DioClient {
  late final Dio _dio;
  final SharedPreferences _prefs;
  final String _baseUrl;

  DioClient({
    required SharedPreferences prefs,
    String? baseUrl,
  }) : _prefs = prefs,
       _baseUrl = baseUrl ?? ApiConstants.baseUrl {
    _dio = Dio(
      BaseOptions(
        baseUrl: _baseUrl,
        connectTimeout: const Duration(milliseconds: AppConstants.connectTimeout),
        receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );
    _dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
      error: true,
    ));
    _dio.interceptors.add(_authInterceptor());
  }

  Interceptor _authInterceptor() {
    return InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = _prefs.getString('access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          final refreshed = await _refreshToken();
          if (refreshed) {
            final retryResponse = await _retry(error.requestOptions);
            handler.resolve(retryResponse);
            return;
          }
        }
        handler.next(error);
      },
    );
  }

  Future<bool> _refreshToken() async {
    try {
      final refreshToken = _prefs.getString('refresh_token');
      if (refreshToken == null) return false;
      final response = await Dio(
        BaseOptions(baseUrl: _baseUrl),
      ).post(
        ApiConstants.refreshToken,
        data: {'refreshToken': refreshToken},
      );
      if (response.statusCode == 200) {
        await _prefs.setString('access_token', response.data['accessToken'] ?? '');
        await _prefs.setString('refresh_token', response.data['refreshToken'] ?? '');
        return true;
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<Response> _retry(RequestOptions requestOptions) async {
    final token = _prefs.getString('access_token');
    final options = Options(
      method: requestOptions.method,
      headers: {
        ...requestOptions.headers,
        'Authorization': 'Bearer $token',
      },
    );
    return _dio.request(
      requestOptions.path,
      data: requestOptions.data,
      queryParameters: requestOptions.queryParameters,
      options: options,
    );
  }

  Future<Response> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.get(path, queryParameters: queryParameters, options: options);
  }

  Future<Response> post(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.post(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> put(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.put(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> patch(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.patch(path, data: data, queryParameters: queryParameters, options: options);
  }

  Future<Response> delete(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.delete(path, queryParameters: queryParameters, options: options);
  }

  Future<Response> upload(
    String path, {
    required FormData data,
    void Function(int, int)? onSendProgress,
  }) async {
    return _dio.post(
      path,
      data: data,
      onSendProgress: onSendProgress,
      options: Options(
        headers: {'Content-Type': 'multipart/form-data'},
      ),
    );
  }
}
