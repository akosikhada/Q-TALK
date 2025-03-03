import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { storage } from "../utils/storage";

SplashScreen.preventAutoHideAsync();
const RootNavigation = () => {
  const [isLogin, setIsLogin] = useState(false);
  const access_token = storage.getString("access_token");
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    console.log(access_token);
    if (access_token) {
      setIsLogin(true);
    }
  }, [access_token]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {isLogin ? <Redirect href={"/(main)"} /> : <Redirect href={"/(auth)"} />}
    </>
  );
};

export default RootNavigation;
