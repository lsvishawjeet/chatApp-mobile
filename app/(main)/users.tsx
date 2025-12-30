import { useSocket } from '@/context/SocketContext';
import { allUsersApiResponse, User } from '@/interfaces/apiResponse';
import { getAllUsersService } from '@/services/authService';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

const Users = () => {
    const {onlineUsers, fetchOnlineUsers} = useSocket();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const fetchUsers=async()=>{
        const data:allUsersApiResponse = await getAllUsersService();
        setUsers(data.data);
        fetchOnlineUsers
    }
    useEffect(()=>{
        fetchUsers();

    },[])
    return (
        <View>
            <FlatList
                data={users}
                keyExtractor={(user)=>user._id}
                renderItem={({item})=>{
                    return(
                    <Pressable
                    onPress={() => router.push({
                        pathname: "/(main)/chat/[id]",
                        params: {id: item._id}
                    })}>
                    <View className='flex-row'>
                        <Text>{onlineUsers.find((usr)=>usr.userId == item._id) ? "*" : ""}</Text>
                        <Text>{item.name}</Text>
                    </View>
                    </Pressable>
                    )
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({})

export default Users;