class ServerException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ServerException({required this.message, this.statusCode, this.data});

  @override
  String toString() => 'ServerException: $message (status: $statusCode)';
}

class NetworkException implements Exception {
  final String message;
  NetworkException({this.message = 'No internet connection'});

  @override
  String toString() => 'NetworkException: $message';
}

class AuthException implements Exception {
  final String message;
  final int? statusCode;

  AuthException({required this.message, this.statusCode});

  @override
  String toString() => 'AuthException: $message';
}

class CacheException implements Exception {
  final String message;
  CacheException({this.message = 'Cache error'});

  @override
  String toString() => 'CacheException: $message';
}
