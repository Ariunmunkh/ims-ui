import { useState } from 'react';
import jwt_decode from "jwt-decode";

export default function useUserInfo() {

    const getUserInfo = () => {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        if (token) {
            const decoded = jwt_decode(token?.access_token);
            return decoded;
        }
        return '-1';

    };

    const [userinfo, setUserInfo] = useState(getUserInfo());

    const saveuserinfo = userinfo => {
        setUserInfo(userinfo);
    };

    return { setUserInfo: saveuserinfo, userinfo }

}