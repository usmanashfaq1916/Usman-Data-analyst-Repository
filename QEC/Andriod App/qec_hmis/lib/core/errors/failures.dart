import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  final int? statusCode;

  const Failure({required this.message, this.statusCode});

  @override
  List<Object?> get props => [message, statusCode];
}

class ServerFailure extends Failure {
  const ServerFailure({super.message = 'Server error', super.statusCode});
}

class NetworkFailure extends Failure {
  const NetworkFailure({super.message = 'No internet connection'});
}

class AuthFailure extends Failure {
  const AuthFailure({super.message = 'Authentication failed', super.statusCode});
}

class ValidationFailure extends Failure {
  final Map<String, String>? errors;
  const ValidationFailure({super.message = 'Validation failed', this.errors});

  @override
  List<Object?> get props => [message, errors];
}

class StorageFailure extends Failure {
  const StorageFailure({super.message = 'Storage error'});
}

class NotFoundFailure extends Failure {
  const NotFoundFailure({super.message = 'Not found', super.statusCode});
}

class PermissionFailure extends Failure {
  const PermissionFailure({super.message = 'Permission denied', super.statusCode});
}
