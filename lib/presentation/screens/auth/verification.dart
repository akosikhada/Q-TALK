import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:q_talk/presentation/screens/auth/success.dart';


class VerificationScreen extends StatefulWidget {
  const VerificationScreen({super.key});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  TextEditingController otpController = TextEditingController();
  bool isError = false;
  String correctOTP = "627415"; // Replace with actual OTP logic
  int resendTime = 58;

  @override
  void dispose() {
    otpController.dispose();
    super.dispose();
  }

  void verifyOTP() {
    if (otpController.text == correctOTP) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const SuccessScreen()),
      );
    } else {
      setState(() {
        isError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
        elevation: 0,
        backgroundColor: Colors.transparent,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (isError)
              Container(
                padding: const EdgeInsets.all(8),
                color: Colors.red.shade100,
                child: const Text(
                  "\u26A0 incorrect verification code",
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                ),
              ),
            const SizedBox(height: 20),
            const Text(
              "Verify your otp code has been sent to your email",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            const Text("Enter the 6-digit code sent to you at"),
            const SizedBox(height: 20),
            PinCodeTextField(
              appContext: context,
              length: 6,
              controller: otpController,
              keyboardType: TextInputType.number,
              autoDismissKeyboard: true,
              onChanged: (value) {},
              pinTheme: PinTheme(
                shape: PinCodeFieldShape.box,
                borderRadius: BorderRadius.circular(5),
                fieldHeight: 50,
                fieldWidth: 40,
                activeFillColor: Colors.white,
                selectedFillColor: Colors.white,
                inactiveFillColor: Colors.white,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: verifyOTP,
              style: ElevatedButton.styleFrom(
                backgroundColor: Color(0xFF2E7D32),
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text("Confirm", style: TextStyle(color: Colors.white)),
            ),
            const SizedBox(height: 10),
            Center(
              child: Text(
                "Resend in 00:${resendTime.toString().padLeft(2, '0')}",
                style: const TextStyle(color: Colors.grey),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
