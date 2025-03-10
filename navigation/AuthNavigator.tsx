import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SplashScreen from "../screens/SplashScreen";
import AuthScreen from "../screens/AuthScreen";
import OTPScreen from "../screens/OTPScreen";

export type AuthStackParamList = {
  Splash: undefined;
  Auth: undefined;
  OTP: { phoneOrEmail: string };
};

const Stack = createStackNavigator<AuthStackParamList>();

type AuthNavigatorProps = {
  onAuthenticated: () => void;
};

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ onAuthenticated }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  const handleGetStarted = (navigation: any) => {
    // Navigate to Auth screen
    navigation.navigate("Auth");
  };

  const handleAuthenticate = (
    phoneOrEmail: string,
    password: string,
    isSignUp: boolean,
    navigation: any
  ) => {
    setPhoneOrEmail(phoneOrEmail);
    // In a real app, you would make an API call here
    // For now, we'll just navigate to OTP screen
    navigation.navigate("OTP");
  };

  const handleVerifyOTP = (otp: string) => {
    // In a real app, you would verify the OTP with an API call
    // For now, we'll just complete the authentication
    onAuthenticated();
  };

  const handleResendOTP = () => {
    // In a real app, you would make an API call to resend the OTP
    console.log("Resending OTP...");
  };

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
            onAuthenticate={(email, password, isSignUp) =>
              handleAuthenticate(email, password, isSignUp, props.navigation)
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="OTP">
        {(props) => (
          <OTPScreen
            {...props}
            phoneOrEmail={phoneOrEmail}
            onVerify={handleVerifyOTP}
            onResendOTP={handleResendOTP}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthNavigator;
