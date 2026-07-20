import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConfig {
  static String get baseUrl => kIsWeb || !Platform.isAndroid
      ? 'http://localhost:5063/api'
      : 'http://10.0.2.2:5063/api';
}
