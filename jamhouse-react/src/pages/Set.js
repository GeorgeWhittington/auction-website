import { useParams, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { addToBasket } from "../basket";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../constants";

function Set() {
    const [set, setSet] = useState(null);
    const { id } = useParams();
    const [cookies, setCookie] = useCookies(["basket"]);

    function handleBasketClick() {
        let basket = cookies.basket;
        console.log(basket);

        addToBasket(basket, setCookie, id, "set", set);
    }

    useEffect(() => {
        axios.get(api + `/sets/${id}/`)
        .then((response) => {
            console.log(response.data);
            setSet(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    return (
        <div>
            <h2>Set: {id}</h2>
            <p>The data for a specific set, getting this info from the rest api</p>
            <a href="#" onClick={handleBasketClick}>Add to basket</a>
        </div>
    );
}

export default Set;