import axios from "axios";
import { api } from "../constants";
import { FormAwesome, FormBreak, FormInput } from "../components/Form"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Profile() {

    const [cookies, setCookie] = useCookies();
    const [accessToken, setAccessToken] = useState(cookies["access-token"]);

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [email, setEmail] = useState("");

    const [uStatus, setUStatus] = useState("");

    const [uFName, setUFName] = useState("");
    const [uLName, setULName] = useState("");
    const [uEmail, setUEmail] = useState("");
    const [uPass, setUPass] = useState("");
    const [uConfirmPass, setUConfirmPass] = useState("");

    function loadDetails() {
        axios.get(api + "/me?v=1", { headers: { "Authorization": `Token ${accessToken}` } })
            .then((response) => {
                console.log(response)
                setFName(response.data['first_name']);
                setLName(response.data['last_name']);
                setEmail(response.data['email'])
            })
            .catch((error) => { }
            )
    }

    useEffect(() => {
        loadDetails();
    }, [accessToken])



    function changeNameSubmit(e) {
        e.preventDefault();
        
        if (uFName.length == 0 || uLName.length == 0) {
            setUStatus("Please enter a first and last name");
            return;
        }

        axios.post(api + "/update-name", { 'first_name': uFName, 'last_name': uLName }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                setUStatus(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatus(error.response.data['msg']);
                loadDetails();
            });


    }

    function changeEmailSubmit(e) {
        e.preventDefault();

        if (!uEmail.includes('@')) {
            setUStatus("Please enter a valid email address");
            return;
        }

        axios.post(api + "/update-email", { 'email': uEmail }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                console.log(response);
                setUStatus(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatus(error.response.data['msg'])
            });


    }

    function changePasswordSubmit(e) {
        e.preventDefault();

        if (uPass != uConfirmPass) {
            setUStatus("Passwords Must Match!");
            return;
        }

        if (uPass.length < 6) {
            setUStatus("Please enter a password");
            return;
        }

        axios.post(api + "/update-password", { 'password': uPass }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                console.log(response);
                setUStatus(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatus(error.response.data['msg'])
            });
    }

    return (

        <div>

            <h3>{fname} {lname} ({email})</h3>

            <b><i><center>&nbsp;{uStatus}</center></i></b>

            <h4>Change Name</h4>
            <hr></hr>
            <FormAwesome submitText="Update Name" onSubmit={changeNameSubmit} autocomplete="off">
                <FormInput label="First Name:" id="fname" type="text" onChange={e => setUFName(e.target.value)} placeholder={fname}></FormInput>
                <FormInput label="Last Name:" id="lastname" type="text" onChange={e => setULName(e.target.value)} placeholder={lname}></FormInput>
            </FormAwesome>

            <br></br>

            <h4>Change Email</h4>
            <hr></hr>

            <FormAwesome submitText="Update Email" onSubmit={changeEmailSubmit} autocomplete="off">
                <FormInput label="Email:" id="uemail" type="email" onChange={e => setUEmail(e.target.value)} placeholder={email}></FormInput>
            </FormAwesome>

            <br></br>

            <h4>Change Password</h4>
            <hr></hr>
            <FormAwesome submitText="Update Password" onSubmit={changePasswordSubmit} autocomplete="off">
                <FormInput label="Password:" id="upass" type="password" autocomplete="new-password" onChange={e => setUPass(e.target.value)}></FormInput>
                <FormInput label="Confirm Password:" id="uconfpass" type="password" autocomplete="new-password" onChange={e => setUConfirmPass(e.target.value)}></FormInput>
            </FormAwesome>
        </div>


    )
}