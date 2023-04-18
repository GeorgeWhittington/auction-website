import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { addToBasket } from "../basket";

function Set() {
    const { id } = useParams();
    const [cookies, setCookie] = useCookies(["basket"]);

    function handleBasketClick() {
        let basket = cookies.basket;
        console.log(basket);

        addToBasket(basket, setCookie, id, "set");
    }

    return (
        <div>
            <h2>Set: {id}</h2>
            <p>The data for a specific set, getting this info from the rest api</p>
            <a href="#" onClick={handleBasketClick}>Add to basket</a>
        </div>
    );
}

export default Set;