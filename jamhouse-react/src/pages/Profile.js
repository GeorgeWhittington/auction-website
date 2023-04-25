import axios from "axios";
import { api } from "../constants";
import { FormAwesome, FormBreak, FormInput } from "../components/Form"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { numberRegex, currentYear, countries } from "../constants"

export default function Profile() {

    const [cookies, setCookie] = useCookies();
    const [accessToken, setAccessToken] = useState(cookies["access-token"]);

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [email, setEmail] = useState("");

    const [addr, setAddr] = useState("");
    const [addrCity, setAddrCity] = useState("");
    const [addrCounty, setAddrCounty] = useState("");
    const [addrCountry, setAddrCountry] = useState("");
    const [addrPostcode, setAddrPostcode] = useState("");

    const [uStatusName, setUStatusName] = useState("");
    const [uStatusEmail, setUStatusEmail] = useState("");
    const [uStatusPassword, setUStatusPassword] = useState("");
    const [uStatusAddress, setUStatusAddress] = useState("");

    const [uFName, setUFName] = useState("");
    const [uLName, setULName] = useState("");
    const [uEmail, setUEmail] = useState("");
    const [uPass, setUPass] = useState("");
    const [uConfirmPass, setUConfirmPass] = useState("");

    const [uAddr, setUAddr] = useState("");
    const [uAddrCity, setUAddrCity] = useState("");
    const [uAddrCounty, setUAddrCounty] = useState("");
    const [uAddrCountry, setUAddrCountry] = useState("");
    const [uAddrPostcode, setUAddrPostcode] = useState("");

    const countryOptions = [];
    
    for (const[key, value] of Object.entries(countries)) {
      countryOptions.push(<option value={key} key={key}>{value}</option>);
    }

    function loadDetails() {
        axios.get(api + "/me?v=1", { headers: { "Authorization": `Token ${accessToken}` } })
            .then((response) => {
                console.log(response)
                setFName(response.data['first_name']);
                setLName(response.data['last_name']);
                setEmail(response.data['email'])

                if (response.data['checkout_info']) {
                    setAddr(response.data['checkout_info']['addr_address']);
                    setAddrCity(response.data['checkout_info']['addr_city']);
                    setAddrCounty(response.data['checkout_info']['addr_county']);
                    setAddrCountry(response.data['checkout_info']['addr_country']);
                    setAddrPostcode(response.data['checkout_info']['addr_postcode']);

                }
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
            setUStatusName("Please enter a first and last name");
            return;
        }

        axios.post(api + "/update-name", { 'first_name': uFName, 'last_name': uLName }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                setUStatusName(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatusName(error.response.data['msg']);
                loadDetails();
            });


    }

    function changeEmailSubmit(e) {
        e.preventDefault();

        if (!uEmail.includes('@')) {
            setUStatusEmail("Please enter a valid email address");
            return;
        }

        axios.post(api + "/update-email", { 'email': uEmail }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                console.log(response);
                setUStatusEmail(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatusEmail(error.response.data['msg'])
            });


    }

    function changePasswordSubmit(e) {
        e.preventDefault();

        if (uPass != uConfirmPass) {
            setUStatusPassword("Passwords Must Match!");
            return;
        }

        if (uPass.length < 6) {
            setUStatusPassword("Please enter a password");
            return;
        }

        axios.post(api + "/update-password", { 'password': uPass }, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                console.log(response);
                setUStatusPassword(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatusPassword(error.response.data['msg'])
            });
    }

    function changeAddressSubmit(e) {
        e.preventDefault();
        
        if (uAddr.length < 3) { setUStatusAddress("Please enter an address"); return; }
        if (uAddrCity.length < 3) { setUStatusAddress("Please enter a city"); return; }
        if (uAddrCounty.length < 3) { setUStatusAddress("Please enter a county"); return; }
        if (uAddrPostcode.length < 3) { setUStatusAddress("Please enter a postcode"); return; }
        
        let data = {
            "addr_address" : uAddr,
            "addr_city" : uAddrCity,
            "addr_country" : uAddrCountry,
            "addr_county" : uAddrCounty,
            "addr_postcode" : uAddrPostcode,
        }

        console.log(data);

        
        axios.post(api + "/update-address", data, { headers: { "Authorization": `Token ${accessToken}` } })
            .then(function (response) {
                setUStatusAddress(response.data['msg']);
                loadDetails();
            })
            .catch(function (error) {
                setUStatusAddress(error.response.data['msg'])
        });

    }

    return (

        <div>

            <h3>{fname} {lname} ({email})</h3>

            <h4>Change Name</h4>    
            <i>{uStatusName}</i>
            <hr></hr>
            <FormAwesome submitText="Update Name" onSubmit={changeNameSubmit} autocomplete="off">
                <FormInput label="First Name:" id="fname" type="text" onChange={e => setUFName(e.target.value)} placeholder={fname}></FormInput>
                <FormInput label="Last Name:" id="lastname" type="text" onChange={e => setULName(e.target.value)} placeholder={lname}></FormInput>
            </FormAwesome>

            <br></br>

            <h4>Change Email</h4>
            <i>{uStatusEmail}</i>
            <hr></hr>

            <FormAwesome submitText="Update Email" onSubmit={changeEmailSubmit} autocomplete="off">
                <FormInput label="Email:" id="uemail" type="email" onChange={e => setUEmail(e.target.value)} placeholder={email}></FormInput>
            </FormAwesome>

            <br></br>

            <h4>Change Password</h4>
            <i>{uStatusPassword}</i>
            <hr></hr>
            <FormAwesome submitText="Update Password" onSubmit={changePasswordSubmit} autocomplete="off">
                <FormInput label="Password:" id="upass" type="password" autocomplete="new-password" onChange={e => setUPass(e.target.value)}></FormInput>
                <FormInput label="Confirm Password:" id="uconfpass" type="password" autocomplete="new-password" onChange={e => setUConfirmPass(e.target.value)}></FormInput>
            </FormAwesome>

            <br></br>

            <h4>Change Address</h4>
            <i>{uStatusAddress}</i>
            <hr></hr>
            <FormAwesome submitText="Update Address" autocomplete="off" onSubmit={changeAddressSubmit}>
                <FormInput label="Address:" id="addr" type="text" placeholder={addr} onChange={e => setUAddr(e.target.value)}></FormInput>
                <FormInput label="City:" id="addrCity" type="text" placeholder={addrCity} onChange={e => setUAddrCity(e.target.value)}></FormInput>
                <FormInput label="County:" id="addrCounty" type="text" placeholder={addrCounty} onChange={e => setUAddrCounty(e.target.value)}></FormInput>
                <label htmlFor="selCountry">Country</label>
                <select id="selCountry" className="form-select" value={addrCountry} onChange={e => setUAddrCountry(e.target.value)}>
                    <option value="" disabled>Country</option>
                    { countryOptions.map((option) => {return option;}) }
                </select>

                <FormInput label="Postcode:" id="addrPostcode" type="text" placeholder={addrPostcode} onChange={e => setUAddrPostcode(e.target.value)}></FormInput>
            </FormAwesome>

        </div>


    )
}