import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/theme/app_theme.dart';
import 'presentation/providers/theme_provider.dart';
import 'presentation/screens/splash/splash_screen.dart';
import 'presentation/screens/auth/login_screen.dart';
import 'presentation/screens/dashboard/dashboard_screen.dart';
import 'presentation/screens/students/student_list_screen.dart';
import 'presentation/screens/students/student_detail_screen.dart';
import 'presentation/screens/attendance/attendance_screen.dart';
import 'presentation/screens/exams/exam_list_screen.dart';
import 'presentation/screens/fees/fee_screen.dart';
import 'presentation/screens/teachers/teacher_list_screen.dart';
import 'presentation/screens/timetable/timetable_screen.dart';
import 'presentation/screens/library/library_screen.dart';
import 'presentation/screens/transport/transport_screen.dart';
import 'presentation/screens/hostel/hostel_screen.dart';
import 'presentation/screens/reports/reports_screen.dart';

class App extends ConsumerWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);

    return MaterialApp(
      title: 'QEC HMIS',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      initialRoute: '/splash',
      onGenerateRoute: (settings) {
        final routes = <String, WidgetBuilder>{
          '/splash': (_) => const SplashScreen(),
          '/login': (_) => const LoginScreen(),
          '/': (_) => const DashboardScreen(),
          '/students': (_) => const StudentListScreen(),
          '/attendance': (_) => const AttendanceScreen(),
          '/exams': (_) => const ExamListScreen(),
          '/fees': (_) => const FeeScreen(),
          '/teachers': (_) => const TeacherListScreen(),
          '/timetable': (_) => const TimetableScreen(),
          '/library': (_) => const LibraryScreen(),
          '/transport': (_) => const TransportScreen(),
          '/hostel': (_) => const HostelScreen(),
          '/reports': (_) => const ReportsScreen(),
        };

        final uri = Uri.parse(settings.name ?? '');
        final path = uri.path;

        if (routes.containsKey(path)) {
          return MaterialPageRoute(
            builder: routes[path]!,
            settings: settings,
          );
        }

        if (path.startsWith('/students/')) {
          final id = path.split('/').last;
          return MaterialPageRoute(
            builder: (_) => StudentDetailScreen(studentId: id),
            settings: settings,
          );
        }

        if (path.startsWith('/exams/')) {
          return MaterialPageRoute(
            builder: (_) => const ExamListScreen(),
            settings: settings,
          );
        }

        return MaterialPageRoute(
          builder: (_) => const SplashScreen(),
          settings: settings,
        );
      },
    );
  }
}
