import { useParams, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { addToBasket } from "../basket";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import "./Set.css";

function Set() {
    const [set, setSet] = useState(null);

    const { id } = useParams();
    const [cookies, setCookie] = useCookies(["basket"]);

    function handleBasketClick() {
      if (set.sold === true) {
        alert("Set already sold")
        return;
      }

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
        return <a href={`/item/${item.id}`}><img src={item.images[0].img} className="set-img"></img></a>
      }
      else {
        return <a href={`/item/${item.id}`}><FontAwesomeIcon icon={faImage} className="set-imgmissing" /></a>
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

    if (set !== null) {
      return (
          <div>
            <div class="set-desc">
              <h2><u>{set.description}</u></h2>
            </div>
            <p>Debug Set ID: {id}</p>
            <div class="imgbox">
              { set !== null ?
              set.items.map(render_item_image)
              : "" }
            </div>
            <div className="set-pricebasket">
              <p>Price: £{set.price}</p>
              { set.sold ? <p className="set-sold">Set already sold</p> : <a href="#" onClick={handleBasketClick} className="set-button">Add to basket</a> }  
            </div>
          </div>
      );
    }
}

export default Set;