import axios from "axios";
import { useState } from "react";
import { FormAwesome, FormInput, FormBreak } from "../components/Form";
import { api } from "../constants";
import { useNavigate } from "react-router-dom";

function Register() {

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confpass, setConfPass] = useState("");

  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  /* crude client side validation */
  function validate() {
    if      (fname.length === 0)  { setMsg("Please enter a first name"); return false; }
    else if (lname.length === 0)  { setMsg("Please enter a last name"); return false; }
    else if (email.length === 0)  { setMsg("Please enter an email address"); return false; }
    else if (pass.length === 0)   { setMsg("Please enter a password"); return false; }
    else if (pass !== confpass)   { setMsg("Passwords must match"); return false; }
    setMsg("");
    return true;
  }

  function onFormSubmit(e) {
    e.preventDefault();

    if (validate()) {

      let post_data = {
        "email": email,
        "password": pass,
        "first_name": fname,
        "last_name": lname
      }

      axios.post(api + "/register/", post_data)
        .then(function (response) {
          navigate('/login?register=1'); // if our user was created successfully then go to login page
        })
        .catch(function (error) {
          // Show first error from server if we have one
          if (error.response.data) {
            for (var key in error.response.data) {
              setMsg(error.response.data[key][0]);
            }
          }
        });
    }
  }

  return (
    <div>

      <h2>Register</h2>

      <FormAwesome submitText="Register" onSubmit={onFormSubmit}>

        <FormInput label="First Name:" id="fname" type="text" value={fname} onChange={e => setFname(e.target.value)}></FormInput>
        <FormInput label="Last Name:" id="lname" type="text" value={lname} onChange={e => setLname(e.target.value)}></FormInput>

        <FormBreak></FormBreak>

        <FormInput label="Email:" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}></FormInput>

        <FormBreak></FormBreak>

        <FormInput label="Password:" id="pass" type="password" value={pass} onChange={e => setPass(e.target.value)}></FormInput>
        <FormInput label="Confirm Password:" id="confirmpass" type="password" value={confpass} onChange={e => setConfPass(e.target.value)}></FormInput>

      </FormAwesome>

      <p>Already have an account with us? <a href="login">Login instead</a></p>

      <br></br>

      <b className="error-msg"><center>{msg}</center></b>

    </div>
  );
}

export default Register;