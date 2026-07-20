import 'package:flutter_test/flutter_test.dart';
import 'package:siren_store_mobile/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const SirenStoreApp());
    expect(find.text('Siren Store'), findsOneWidget);
  });
}
