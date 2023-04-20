import axios from "axios";
import { api } from "../constants";
import { FormAwesome, FormBreak, FormInput } from "../components/Form"

export default function Profile() {

    axios.get()
    function changeEmailSubmit(e) {
        e.preventDefault();
    }

    return (
    
    <div>

        <h3>Profile</h3>
    
        <FormAwesome submitText="Change Email" onSubmit={changeEmailSubmit}>
            <FormInput label="Email:" id="email" type="email"></FormInput>
        </FormAwesome>

        <hr></hr>
    </div>
    

    )
}