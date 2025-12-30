import { allUsersApiResponse, authApiResponse } from "@/interfaces/apiResponse";
import apiClient from "./apiClient";

export const healthCheckService = async ()=>{
    const response = await apiClient.get("/health")
    return response.data;
}

export const loginService = async (email: string, password: string) =>{
    try {
        const response = await apiClient.post('/auth/login', {
        email,
        password
    });

    if(response.status == 200){
        // saveToken(response.data.token)
        // console.log(response.data)
    }
    return response.data;
    } catch (error:any) {
        if (error.response.data as authApiResponse) {
      return error.response.data;
    }

    return { success: false, message: "Network error" };
    }
}

export const getAllUsersService = async () =>{
    try {
        const response = await apiClient.get('/user/all');
        console.log(response.data)
        return response.data as allUsersApiResponse;
    } catch (error:any) {
        if (error.response.data as allUsersApiResponse) {
        return error.response.data;
    }

    return { success: false, message: "Network error" };
    }
}