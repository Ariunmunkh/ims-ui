import { useState } from 'react';
import jwt_decode from "jwt-decode";

export default function useToken() {

    const getRole = () => {
        const tokenString = localStorage.getItem('token');
        const token = JSON.parse(tokenString);
        if (token) {
            const decoded = jwt_decode(token?.access_token);
            return decoded?.roleid;
        }
        return '-1';

    };

    const [roleid, setRoleid] = useState(getRole());

    const saverole = userRole => {
        setRoleid(userRole);
    };

    return { setRoleid: saverole, roleid }

}