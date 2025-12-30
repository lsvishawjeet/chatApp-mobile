import { healthCheckService } from '@/services/authService';
import { getToken } from '@/utilities/authStore';
import { useRoute } from '@react-navigation/native';
import { Redirect, useRootNavigationState, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const checkIfLoggedIn=async()=>{
    const token = await getToken();
    if(token?.length != null){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  }

  useEffect(()=>{
    checkIfLoggedIn();
  },[])

  if (!isLoggedIn) {
    // Redirect component handles the timing logic for you
    return <Redirect href="/(auth)/login" />;
  } else{
    return <Redirect href="/(main)/users" />;
  }

}

const styles = StyleSheet.create({})

export default Index;
