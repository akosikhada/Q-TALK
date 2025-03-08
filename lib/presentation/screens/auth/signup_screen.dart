import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:q_talk/core/common/custom_button.dart';
import 'package:q_talk/core/common/custom_text_field.dart';
import 'package:q_talk/presentation/screens/auth/login_screen.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  // Form key for validation
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  // Password visibility state
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  // Focus nodes
  final _nameFocus = FocusNode();
  final _usernameFocus = FocusNode();
  final _emailFocus = FocusNode();
  final _phoneFocus = FocusNode();
  final _passwordFocus = FocusNode();
  final _confirmPasswordFocus = FocusNode();

  @override
  void dispose() {
    // Dispose controllers to prevent memory leaks
    emailController.dispose();
    nameController.dispose();
    usernameController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();

    // Dispose focus nodes to prevent memory leaks
    _nameFocus.dispose();
    _usernameFocus.dispose();
    _emailFocus.dispose();
    _phoneFocus.dispose();
    _passwordFocus.dispose();
    _confirmPasswordFocus.dispose();

    super.dispose();
  }

  // Validation methods
  String? _validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your full name';
    }
    return null;
  }

  String? _validateUsername(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your username';
    }
    return null;
  }

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

  String? _validateConfirmPassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please confirm your password';
    }

    if (value != passwordController.text) {
      return 'Passwords do not match';
    }

    return null;
  }

  String? _validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your phone number';
    }

    final phoneRegex = RegExp(r'^\+?[\d\s-]{10,}$');
    if (!phoneRegex.hasMatch(value)) {
      return 'Please enter a valid phone number';
    }

    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        automaticallyImplyLeading: true,
        toolbarHeight: 40,
      ),
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
                // Title
                Text(
                  "Create an account",
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 10),

                // Subtitle
                Text(
                  "Please fill in the details below to continue",
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: Colors.grey),
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 20),

                // Full Name field
                CustomTextField(
                  controller: nameController,
                  focusNode: _nameFocus,
                  hintText: "Mark Angelo Pogi",
                  validator: _validateName,
                  prefixIcon: const Icon(Icons.person_outlined),
                ),

                const SizedBox(height: 16),

                // Username field
                CustomTextField(
                  controller: usernameController,
                  focusNode: _usernameFocus,
                  hintText: "markpogi123",
                  validator: _validateUsername,
                  prefixIcon: const Icon(Icons.alternate_email_outlined),
                ),

                const SizedBox(height: 16),

                // Email field
                CustomTextField(
                  controller: emailController,
                  focusNode: _emailFocus,
                  hintText: "mark.pogi.123@example.com",
                  validator: _validateEmail,
                  prefixIcon: const Icon(Icons.email_outlined),
                ),

                const SizedBox(height: 16),

                // Phone field
                CustomTextField(
                  controller: phoneController,
                  focusNode: _phoneFocus,
                  hintText: "(+63) 000 0000 000",
                  validator: _validatePhone,
                  prefixIcon: const Icon(Icons.phone_outlined),
                ),

                const SizedBox(height: 16),

                // Password field
                CustomTextField(
                  controller: passwordController,
                  focusNode: _passwordFocus,
                  hintText: "**********",
                  validator: _validatePassword,
                  obscureText: !_isPasswordVisible,
                  prefixIcon: const Icon(Icons.lock_outlined),
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

                const SizedBox(height: 16),

                // Confirm Password field
                CustomTextField(
                  controller: confirmPasswordController,
                  focusNode: _confirmPasswordFocus,
                  hintText: "**********",
                  validator: _validateConfirmPassword,
                  obscureText: !_isConfirmPasswordVisible,
                  prefixIcon: const Icon(Icons.lock_outlined),
                  suffixIcon: IconButton(
                    onPressed: () {
                      setState(() {
                        _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                      });
                    },
                    icon: Icon(
                      _isConfirmPasswordVisible
                          ? Icons.visibility_off
                          : Icons.visibility,
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Create Account button
                CustomButton(
                  onPressed: () {
                    // Hide keyboard
                    FocusScope.of(context).unfocus();

                    // Validate form before proceeding
                    if (_formKey.currentState?.validate() ?? false) {
                      // TODO: Implement account creation logic
                    }
                  },
                  text: "Create Account",
                ),

                const SizedBox(height: 16),

                // Login link
                Center(
                  child: RichText(
                    text: TextSpan(
                      text: "Already have an account? ",
                      style: TextStyle(color: Colors.grey[600]),
                      children: [
                        TextSpan(
                          text: "Login",
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
                                      builder: (context) => const LoginScreen(),
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
