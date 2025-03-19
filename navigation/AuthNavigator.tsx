import React, { useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import OTPScreen from "../screens/OTPScreen";

export type AuthStackParamList = {
  Splash: undefined;
  Auth: undefined;
  SignIn: undefined;
  SignUp: undefined;
  OTP: { phoneOrEmail: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = {
  onAuthenticated: () => void;
};

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  const handleGetStarted = useCallback((navigation: any) => {
    // Navigate to Auth screen where user can choose to sign in or sign up
    navigation.navigate("Auth");
  }, []);

  const handleNavigateToSignIn = useCallback((navigation: any) => {
    navigation.navigate("SignIn");
  }, []);

  const handleNavigateToSignUp = useCallback((navigation: any) => {
    navigation.navigate("SignUp");
  }, []);

  const handleVerifyOTP = useCallback(
    (otp: string) => {
      // The OTP validation is now handled in our OTPScreen component
      onAuthenticated();
    },
    [onAuthenticated]
  );
  const handleResendOTP = useCallback(() => {
    // In a real app, you would make an API call to resend the OTP
    console.log("Resending OTP...");
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash">
        {(props) => (
          <SplashScreen
            {...props}
            onGetStarted={() => handleGetStarted(props.navigation)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Auth">
        {(props) => (
          <AuthScreen
            {...props}
            onSignIn={() => handleNavigateToSignIn(props.navigation)}
            onSignUp={() => handleNavigateToSignUp(props.navigation)}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} />}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUpScreen
            {...props}
            onAuthenticate={(email, password) => {
              props.navigation.navigate("OTP", { phoneOrEmail: email });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="OTP">
        {(props) => (
          <OTPScreen
            {...props}
            phoneOrEmail={props.route.params?.phoneOrEmail || phoneOrEmail}
            onVerify={handleVerifyOTP}
            onResendOTP={handleResendOTP}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
