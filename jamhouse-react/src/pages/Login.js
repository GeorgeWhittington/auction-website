import axios from "axios";

import { useState } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate, useSearchParams } from "react-router-dom";

import { api } from "../constants";
import { FormAwesome, FormInput } from "../components/Form";

function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(["access-token"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function onFormSubmit(event) {
    event.preventDefault();

    axios.post(api + "/login", {
      'username': email,
      'password': password
    })
      .then(function (response) {
        setCookie('access-token', response.data.token);

        // if we have come from the register page
        if (searchParams.get('register')) {
          navigate("/"); // Navigate to the home page
        } else {
          navigate(-1); // Navigate back to the previous page the user was on
        }  

      })
      .catch(function (error) {
        if (error.response.data)  {
          for (var key in error.response.data) {
            setMsg(error.response.data[key][0]);
          }
        }
      });
  }

  let newAccountMsg = <></>
  if (searchParams.get('register')) {
    newAccountMsg = <b><center>Your account has been created successfully, please log in below:</center></b>
  }

  return (
    <div>
      
      <h3>Login</h3>
      
      {newAccountMsg}
      
      <FormAwesome submitText="Login" onSubmit={onFormSubmit}>
        <FormInput label="Email:" id="username" type="email" onChange={e => setEmail(e.target.value)}></FormInput>
        <FormInput label="Password:" id="password" type="password" onChange={e => setPassword(e.target.value)}></FormInput>
      </FormAwesome>

      <p>Don't have an account? <a href="register">Register</a></p>

      <br></br>

      <b className="error-msg"><center>{msg}</center></b>

    </div>
  );
}

export default Login;