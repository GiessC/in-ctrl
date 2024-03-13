'use server';

import AuthService from '@/services/AuthService';

export interface LoginRequest {
    username: string;
    password: string;
}

const login = async (request: LoginRequest) => {
    console.log('Logging in with', request);
    AuthService.getInstance().login(request);
    return request;
};

export default login;
