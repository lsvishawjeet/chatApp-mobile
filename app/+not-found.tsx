import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const NotFound = () => {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
                <View>
            Page not found dear
        </View>
        </>

    );
}

const styles = StyleSheet.create({})

export default NotFound;
