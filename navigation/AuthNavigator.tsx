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

  const handleSignIn = useCallback(
    (phoneOrEmail: string, password: string, navigation: any) => {
      setPhoneOrEmail(phoneOrEmail);
      // In a real app, you would make an API call here
      // For now, we'll just navigate to OTP screen
      navigation.navigate("OTP", { phoneOrEmail });
    },
    []
  );

  const handleSignUp = useCallback(
    (phoneOrEmail: string, password: string, navigation: any) => {
      setPhoneOrEmail(phoneOrEmail);
      // In a real app, you would make an API call here
      // For now, we'll just navigate to OTP screen
      navigation.navigate("OTP", { phoneOrEmail });
    },
    []
  );

  const handleVerifyOTP = useCallback(
    (otp: string) => {
      // In a real app, you would verify the OTP with an API call
      // For now, we'll just complete the authentication
      console.log("OTP verified:", otp);
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
        {(props) => (
          <SignInScreen
            {...props}
            onAuthenticate={(email, password) =>
              handleSignIn(email, password, props.navigation)
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SignUp">
        {(props) => (
          <SignUpScreen
            {...props}
            onAuthenticate={(email, password) =>
              handleSignUp(email, password, props.navigation)
            }
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
