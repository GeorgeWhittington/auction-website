import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "axios";

import { addToBasket } from "../basket";
import { api } from "../constants";

function Item() {
  const [item, setItem] = useState(null);
  const { id } = useParams();
  const [cookies, setCookie] = useCookies(["basket"]);

  function handleBasketClick() {
    if (item.sold === true) {
      alert("This item has already been sold");
      return;
    }

    let basket = cookies.basket;
    console.log(basket);

    const success = addToBasket(basket, setCookie, id, "item", item);
    if (success === "duplicate") {
      alert("This item is already in your basket");
    } else if (success === "contains") {
        alert("An set containing this item is already in your basket, please remove it first");
    }
  }

  useEffect(() => {
    axios.get(api + `/items/${id}/`)
    .then((response) => {
        console.log(response.data);
        setItem(response.data);
    }).catch((error) => {
        console.log(error);
    })
}, [])

  return (
    <div>
      <h2>Item: {id}</h2>
      <p>The data for a specific item, getting this info from the rest api</p>
      <a href="#" onClick={handleBasketClick}>Add to basket</a>
    </div>
  );
}

export default Item;