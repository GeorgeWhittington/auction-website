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
      // if sold
      // alert("This item has already been sold")

      let basket = cookies.basket;
      console.log(basket);

      const success = addToBasket(basket, setCookie, id, "set", set);
      if (!success) {
          alert("An item from this set is already in your basket, please remove it first");
      }
      if (success === "duplicate") {
        alert("This set is already in your basket");
      } else if (success === "contains") {
          alert("An item from this set is already in your basket, please remove it first");
      }
    }

    function render_item_image(item) {
      if (item.images.length !== 0) {
        return <img src={item.images[0].img}></img>
      }
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
            { set !== null ?
            set.items.map(render_item_image)
            : "" }
        </div>
    );
}

export default Set;