import 'package:flutter_test/flutter_test.dart';
import 'package:qec_hmis/app.dart';

void main() {
  testWidgets('App should build successfully', (WidgetTester tester) async {
    await tester.pumpWidget(const App());
    expect(find.byType(App), findsOneWidget);
  });
}
