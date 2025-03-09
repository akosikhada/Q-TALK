import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:q_talk/core/common/custom_button.dart';
import 'package:q_talk/core/common/custom_text_field.dart';
import 'package:q_talk/presentation/screens/auth/login_screen.dart';
import 'package:q_talk/presentation/screens/auth/verification.dart';


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

  @override
  void dispose() {
    emailController.dispose();
    nameController.dispose();
    usernameController.dispose();
    phoneController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    super.dispose();
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
                  hintText: "Mark Angelo Pogi",
                  prefixIcon: const Icon(Icons.person_outlined),
                ),
                const SizedBox(height: 16),

                // Username field
                CustomTextField(
                  controller: usernameController,
                  hintText: "markpogi123",
                  prefixIcon: const Icon(Icons.alternate_email_outlined),
                ),
                const SizedBox(height: 16),

                // Email field
                CustomTextField(
                  controller: emailController,
                  hintText: "mark.pogi.123@example.com",
                  prefixIcon: const Icon(Icons.email_outlined),
                ),
                const SizedBox(height: 16),

                // Phone field
                CustomTextField(
                  controller: phoneController,
                  hintText: "(+63) 000 0000 000",
                  prefixIcon: const Icon(Icons.phone_outlined),
                ),
                const SizedBox(height: 16),

                // Password field
                CustomTextField(
                  controller: passwordController,
                  hintText: "**********",
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
                  hintText: "**********",
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
                    FocusScope.of(context).unfocus();
                    if (_formKey.currentState?.validate() ?? false) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const VerificationScreen(),
                        ),
                      );
                    }
                  },
                  text: "Create Account",
                ),

                const SizedBox(height: 16),

                // Divider with text "or sign in with Google"
                Row(
                  children: [
                    Expanded(
                      child: Divider(color: Colors.grey[400], thickness: 1),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0),
                      child: Text(
                        "or sign in with",
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                    ),
                    Expanded(
                      child: Divider(color: Colors.grey[400], thickness: 1),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Google Sign-In Button
                OutlinedButton(
                  onPressed: () {
                    // TODO: Implement Google sign-in logic
                  },
                  style: OutlinedButton.styleFrom(
                    backgroundColor: Colors.white,
                    side: const BorderSide(
                      color: Colors.grey,
                      width: 2,
                    ), // Thicker border
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset('lib/assets/google.png', height: 24),
                      const SizedBox(width: 10),
                      const Text(
                        "Sign in with Google",
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
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
