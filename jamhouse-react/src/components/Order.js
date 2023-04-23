import axios from "axios";
import ItemList from "./ItemList"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { orderStatus } from '../constants'
import { api } from "../constants";
import "../components/Order.css"
export default function Order(props) {

    const [cookies, setCookie] = useCookies();
    const [accessToken, setAccessToken] = useState(cookies["access-token"]);

    let date = new Date(props.data.creation_time);
    let items = <></>
    let sets = <></>

    if (props.data.items.length) {
        items = (<div><ItemList items={props.data.items}></ItemList></div>);
    }

    if (props.data.sets.length) {
        sets = (<div><i>Sets:</i></div>);
    }

    function cancelOrder(id) {
        let data = {"id" : id};
        axios.post(api + "/order-cancel", data, { headers: { "Authorization": `Token ${accessToken}` } })
            .then((response) => {
                 window.location.reload(); 
            })
            .catch((error) => { console.log(error.response.data) })
    }

    return (
        <div className="order-item">
            <b>Number: </b>{props.data.number}<br></br>
            <b>Placed: </b>{date.toUTCString()}<br></br>
            <b>Status: </b>{orderStatus[props.data.status]}<br></br>
            
            {items}
            {sets}

            { props.data.status === 0 ? <button className="order-cancel-button" onClick={() => cancelOrder(props.data.id)}>Cancel Order</button> : <></> }

        </div>
    )
}