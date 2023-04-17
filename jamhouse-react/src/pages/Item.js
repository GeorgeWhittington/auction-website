import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { hours24 } from "../constants";

function Item() {
  const { id } = useParams();
  const [cookies, setCookie] = useCookies(["basket"]);

  function handleBasketClick() {
    let basket = cookies.basket;
    console.log(basket);
    if (basket === undefined || !Array.isArray(basket)) {
      basket = [];
    }

    for (let i = 0; i < basket.length; i++) {
      if (basket[i].id === id && basket[i].type === "item") {
        // item already in basket, ignore
        return;
      }
    }

    basket.push({id: id, type: "item"});
    setCookie("basket", basket, {maxAge: hours24});
  }

  return (
    <div>
      <h2>Item: {id}</h2>
      <p>The data for a specific item, getting this info from the rest api</p>
      <a href="#" onClick={handleBasketClick}>Add to basket</a>
    </div>
  );
}

export default Item;