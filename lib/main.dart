import 'package:flutter/material.dart';
import 'package:q_talk/config/theme/app_theme.dart';
import 'package:q_talk/presentation/screens/auth/login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Q-Talk',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: LoginScreen(),
    );
  }
}
