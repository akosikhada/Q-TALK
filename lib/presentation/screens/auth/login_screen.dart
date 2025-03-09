import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:q_talk/core/common/custom_button.dart';
import 'package:q_talk/core/common/custom_text_field.dart';
import 'package:q_talk/presentation/screens/auth/signup_screen.dart';
import 'package:q_talk/presentation/screens/auth/chat.dart'; 

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Form key for validation
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  // Password visibility state
  bool _isPasswordVisible = false;

  // Focus nodes
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();

  @override
  void dispose() {
    // Dispose controllers and focus nodes to prevent memory leaks
    emailController.dispose();
    passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    super.dispose();
  }

  // Validation methods
  String? _validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email address';
    }

    final emailRegex = RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$');
    if (!emailRegex.hasMatch(value)) {
      return 'Please enter a valid email address (e.g., example@email.com)';
    }

    return null;
  }

  String? _validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter a password';
    }

    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final keyboardVisible = MediaQuery.of(context).viewInsets.bottom > 0;

    return Scaffold(
      appBar: AppBar(elevation: 0, backgroundColor: Colors.transparent),
      body: SafeArea(
        top: false,
        child: SingleChildScrollView(
          keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
          padding: const EdgeInsets.symmetric(horizontal: 25.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 10),

                // Logo (only shown when keyboard is not visible)
                if (!keyboardVisible)
                  Center(
                    child: Image.asset(
                      'lib/assets/logo_simple.png',
                      height:
                          size.height *
                          0.20, // Slightly smaller for better proportions
                      width: size.height * 0.20,
                    ),
                  ),

                // Dynamic spacing based on keyboard visibility
                SizedBox(height: keyboardVisible ? 5 : 20),

                // Welcome text
                Text(
                  "Welcome to Q-Talk",
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                // Subtitle
                Text(
                  "Sign in to continue",
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: Colors.grey),
                  textAlign: TextAlign.center,
                ),

                // Dynamic spacing based on keyboard visibility
                SizedBox(height: keyboardVisible ? 20 : 30),

                // Email field
                CustomTextField(
                  controller: emailController,
                  focusNode: _emailFocus,
                  validator: _validateEmail,
                  hintText: "Enter your email",
                  prefixIcon: const Icon(Icons.email_outlined),
                ),

                const SizedBox(height: 16),

                // Password field
                CustomTextField(
                  controller: passwordController,
                  focusNode: _passwordFocus,
                  validator: _validatePassword,
                  obscureText: !_isPasswordVisible,
                  hintText: "Enter your password",
                  prefixIcon: const Icon(Icons.lock_outline),
                  suffixIcon: IconButton(
                    onPressed: () {
                      setState(() {
                        _isPasswordVisible = !_isPasswordVisible;
                      });
                    },
                    icon: Icon(
                      _isPasswordVisible
                          ? Icons.visibility_off
                          : Icons.visibility,
                    ),
                  ),
                ),

                const SizedBox(height: 30),

                // Login button
                CustomButton(
                  onPressed: () {
                    // Validate form before proceeding
                    if (_formKey.currentState?.validate() ?? false) {
                      // TODO: Implement login logic
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const InboxScreen(),
                        ),
                      );
                    }
                  },
                  text: "Login",
                ),

                const SizedBox(height: 20),

                // Sign up link
                Center(
                  child: RichText(
                    text: TextSpan(
                      text: "Don't have an account? ",
                      style: TextStyle(color: Colors.grey[600]),
                      children: [
                        TextSpan(
                          text: "Sign up",
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                          recognizer:
                              TapGestureRecognizer()
                                ..onTap = () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (context) => const SignupScreen(),
                                    ),
                                  );
                                },
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
