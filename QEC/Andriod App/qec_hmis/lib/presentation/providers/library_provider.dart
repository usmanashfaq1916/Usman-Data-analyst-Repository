import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/library_remote_datasource.dart';
import '../../data/repositories/library_repository_impl.dart';
import '../../domain/entities/library.dart';
import '../../domain/repositories/library_repository.dart';
import 'providers.dart';

final libraryRepositoryProvider = Provider<LibraryRepository>((ref) {
  return LibraryRepositoryImpl(
    LibraryRemoteDataSource(ref.read(dioClientProvider)),
  );
});

class LibraryState {
  final List<Book> books;
  final bool isLoading;
  final String? error;
  final String searchQuery;

  const LibraryState({
    this.books = const [],
    this.isLoading = false,
    this.error,
    this.searchQuery = '',
  });

  LibraryState copyWith({
    List<Book>? books,
    bool? isLoading,
    String? error,
    String? searchQuery,
  }) {
    return LibraryState(
      books: books ?? this.books,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      searchQuery: searchQuery ?? this.searchQuery,
    );
  }
}

class LibraryNotifier extends StateNotifier<LibraryState> {
  final LibraryRepository _repository;

  LibraryNotifier(this._repository) : super(const LibraryState());

  Future<void> loadBooks() async {
    state = state.copyWith(isLoading: true, error: null);
    final result = await _repository.getBooks(
      search: state.searchQuery.isNotEmpty ? state.searchQuery : null,
    );
    result.fold(
      (failure) => state = state.copyWith(isLoading: false, error: failure.message),
      (books) => state = state.copyWith(isLoading: false, books: books),
    );
  }

  Future<void> searchBooks(String query) async {
    state = state.copyWith(searchQuery: query);
    await loadBooks();
  }
}

final libraryProvider = StateNotifierProvider<LibraryNotifier, LibraryState>((ref) {
  return LibraryNotifier(ref.read(libraryRepositoryProvider));
});
