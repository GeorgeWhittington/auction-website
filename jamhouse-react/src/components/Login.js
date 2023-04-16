import { useState } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { api } from "../constants";

function LoginForm() {
  const [cookies, setCookie] = useCookies(["access-token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function onFormSubmit(event) {
    event.preventDefault();

    axios.post(api + "/login", {
      'username': username,
      'password': password
    })
      .then(function (response) {
        console.log(response.data);
        setCookie('access-token', response.data.token);
        navigate(-1); // Navigate back to the previous page the user was on
      })
      .catch(function (error) {
        // TODO: handle failed logins
        console.log(error);
      });
  }

  return (
    <form onSubmit={onFormSubmit}>
      <label>Email: <input type="text" value={username} onChange={e => setUsername(e.target.value)} /></label>
      <label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <input type="submit" value="Submit" />
    </form>
  );
}

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm></LoginForm>
    </div>
  );
}

export default Login;