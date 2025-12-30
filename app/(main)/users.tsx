import { useSocket } from '@/context/SocketContext';
import { allUsersApiResponse, OnlineUser, User } from '@/interfaces/apiResponse';
import { getAllUsersService } from '@/services/authService';
import { deleteToken } from '@/utilities/authStore';
import { Stack, useRouter } from 'expo-router';
import { ChevronRight, LogOut, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Users = () => {
    const { onlineUsers, fetchOnlineUsers } = useSocket();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    setTimeout(()=>{
        fetchOnlineUsers();
    }, 5000)

    const fetchUsers = async () => {
        try {
            const data: allUsersApiResponse = await getAllUsersService();
            if (data.success) {
                setUsers(data.data);
                setFilteredUsers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
        fetchOnlineUsers();
    };

    const handleLogout = async () => {
        try {
            await deleteToken();
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const renderItem = ({ item }: { item: User }) => {
        const isOnline = onlineUsers.some((usr: OnlineUser) => usr.userId === item._id);

        return (
            <Pressable
                onPress={() => router.push({
                    pathname: "/(main)/chat/[name]/[id]",
                    params: { id: item._id, name: item.name }
                })}
                className="flex-row items-center bg-white p-4 mb-3 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50"
            >
                <View className="w-12 h-12 bg-indigo-100 rounded-full items-center justify-center mr-4 relative">
                    <Text className="text-primary font-bold text-lg">{getInitials(item.name)}</Text>
                    {isOnline && (
                        <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                </View>

                <View className="flex-1">
                    <Text className="text-text font-bold text-base mb-0.5">{item.name}</Text>
                    <Text className="text-muted text-sm" numberOfLines={1}>
                        {isOnline ? "Online" : "Offline"}
                    </Text>
                </View>

                <ChevronRight size={20} color="#CBD5E1" />
            </Pressable>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />

            <View className="flex-1 px-6">
                <View className="mt-6 mb-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-4xl font-bold text-text tracking-tight">
                            Chats
                        </Text>
                        <Text className="text-muted mt-1 text-lg">
                            Connect with your friends
                        </Text>
                    </View>
                    <Pressable
                        onPress={handleLogout}
                        className="w-12 h-12 bg-white rounded-full items-center justify-center border border-slate-200 shadow-sm active:bg-slate-50"
                    >
                        <LogOut size={22} color="#EF4444" />
                    </Pressable>
                </View>

                <View className="flex-row items-center bg-white border border-slate-200 rounded-2xl px-4 h-14 mb-6 shadow-sm">
                    <Search size={20} color="#64748B" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search people..."
                        placeholderTextColor="#94a3b8"
                        className="flex-1 ml-3 text-text text-base h-full"
                        style={{ includeFontPadding: false, textAlignVertical: 'center' }}
                    />
                </View>

                {loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#4F46E5" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(user) => user._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#4F46E5" />
                        }
                        contentContainerStyle={{ paddingBottom: 20 }}
                        ListEmptyComponent={
                            <View className="items-center justify-center mt-20">
                                <Text className="text-muted text-lg">No users found</Text>
                            </View>
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

export default Users;