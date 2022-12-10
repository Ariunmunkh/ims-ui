import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { message } from "antd";
import { api } from '../../api/api'
import '../../App.css'

export default function SignInPage() {

    const navigate = useNavigate();
    const [errormsg, setErrorMgs] = useState();
    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

    const onLogin = async (values) => {

        try {
            values.preventDefault();

            if (username && password) {

                let tExists = [];
                let rbody = { password: password, username: username };

                await api.post("/api/Systems/login", rbody).then(response => {

                    if (response?.status === 200 && response?.data?.retdata?.access_token?.length > 0) {
                        tExists = response?.data?.retdata?.access_token;
                    }
                });

                if (tExists?.length > 0) {
                    localStorage.setItem("userInfo", JSON.stringify({ token: tExists }));
                    message.success('success');
                    navigate("/home");
                } else {
                    message.error("Нэвтрэх нэр эсвэл нууц үг буруу байна!");
                }
            } else {
                message.error("Нэвтрэх нэр болон нууц үг оруулна уу!");
            }

        } catch (error) {
            debugger;
            setErrorMgs("Нэвтрэх нэр эсвэл нууц үг буруу байна!");
            message.error("Амжилтгүй");
        }
    }

    return (
        <div className="text-center m-5-auto">
            <h2>Sign in to us</h2>
            <form action="/home" onSubmit={onLogin} >
                <p>
                    <label>Username or email address</label><br />
                    <input type="text" name="first_name" onChange={e => setUserName(e.target.value)} required />
                </p>
                <p>
                    <label>Password</label>
                    <Link to="/forget-password"><label className="right-label">Forget password?</label></Link>
                    <br />
                    <input type="password" name="password" onChange={e => setPassword(e.target.value)} required />
                </p>
                <p>
                    <button id="sub_btn" type="submit">Login</button>
                </p>
                <p>
                    <label style={{ color: 'red' }} >{errormsg}</label>
                </p>
            </form>
            <footer>

                <p><Link to="/">Back to Homepage</Link>.</p>
            </footer>
        </div>

    )
}
