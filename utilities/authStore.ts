import * as secureStore from 'expo-secure-store'

export async function saveToken(value: string){
    await secureStore.setItemAsync('user-token', value);
}

export async function getToken(){
    return await secureStore.getItemAsync('user-token');
}