import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/library_provider.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/error_widget.dart';

class LibraryScreen extends ConsumerStatefulWidget {
  const LibraryScreen({super.key});

  @override
  ConsumerState<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends ConsumerState<LibraryScreen> {
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(libraryProvider.notifier).loadBooks();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(libraryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Library'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(libraryProvider.notifier).loadBooks(),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search books...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          ref.read(libraryProvider.notifier).searchBooks('');
                        },
                      )
                    : null,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                filled: true,
                contentPadding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onChanged: (value) => ref.read(libraryProvider.notifier).searchBooks(value),
            ),
          ),
          Expanded(
            child: state.isLoading
                ? const LoadingWidget()
                : state.error != null
                    ? AppErrorWidget(
                        message: state.error!,
                        onRetry: () => ref.read(libraryProvider.notifier).loadBooks(),
                      )
                    : state.books.isEmpty
                        ? const EmptyStateWidget(
                            message: 'No books found',
                            icon: Icons.menu_book,
                          )
                        : RefreshIndicator(
                            onRefresh: () => ref.read(libraryProvider.notifier).loadBooks(),
                            child: ListView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16),
                              itemCount: state.books.length,
                              itemBuilder: (context, index) {
                                final book = state.books[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 48,
                                          height: 64,
                                          decoration: BoxDecoration(
                                            color: AppColors.primary.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: const Icon(Icons.menu_book, color: AppColors.primary),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                book.title,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.w600,
                                                  fontSize: 15,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              if (book.author != null)
                                                Text(
                                                  book.author!,
                                                  style: TextStyle(fontSize: 13, color: Colors.grey[600]),
                                                ),
                                              const SizedBox(height: 2),
                                              Text(
                                                '${book.availableCopies}/${book.totalCopies} available',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: book.isAvailable ? AppColors.success : AppColors.error,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: book.isAvailable
                                                ? AppColors.success.withValues(alpha: 0.1)
                                                : Colors.grey.withValues(alpha: 0.1),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            book.isAvailable ? 'Available' : 'Issued',
                                            style: TextStyle(
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                              color: book.isAvailable ? AppColors.success : Colors.grey,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
