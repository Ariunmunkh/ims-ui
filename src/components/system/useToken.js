import { useState } from 'react';

export default function useToken() {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken?.access_token
    };

    const [token, setToken] = useState(getToken());

    const saveToken = userToken => {
        localStorage.setItem('token', JSON.stringify(userToken));
        localStorage.setItem('access_token', userToken?.access_token);
        setToken(userToken.token);
    };

    return {
        setToken: saveToken,
        token
    }
}