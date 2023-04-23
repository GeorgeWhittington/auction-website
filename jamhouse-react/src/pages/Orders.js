import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { api } from "../constants";
import Order from "../components/Order";

export default function Orders() {

    const [cookies, setCookie] = useCookies();
    const [accessToken, setAccessToken] = useState(cookies["access-token"]);
    const [orders, setOrders] = useState({})

    useEffect(() => {
        axios.get(api + "/orders/", { headers: { "Authorization": `Token ${accessToken}` } })
            .then((response) => { setOrders(response.data) })
            .catch((error) => { })
    }, [accessToken])

    let o = []

    for (let i = 0; i < orders.length; i++) {
        o.push(<Order key={i} data={orders[i]}></Order>)
    }
    
    return (
        <div>
            <h3>Orders</h3>
            {o}
        </div>
    )
}