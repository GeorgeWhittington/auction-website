import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import "./Checkout.css";
import { api } from "../constants";

function AddressForm() {
  return (
    <form id="address-form">
      <input type="email" placeholder="Email" required />
      <input type="text" placeholder="First Name" required />
      <input type="text" placeholder="Last Name" required />
      <input type="text" placeholder="Address" required />
      <input type="text" placeholder="City" required />
      <select defaultValue="" required>
        <option value="" disabled>Country</option>
        {/* all countries */}
      </select>
      <input type="text" placeholder="County" required />
      <input type="text" placeholder="Post Code" required />
      <button type="submit">Submit</button>
    </form>
  );
}

function PaymentForm() {
  return (<div></div>);
}

function CheckoutItem({ item }) {
  if (item.images.length !== 0) {
    var thumbnail = <img src={item.images[0].img} alt={item.images[0].alt} />
  } else {
    var thumbnail = <FontAwesomeIcon icon={faImage} />
  }

  return (
    <div className="checkout-item">
      {thumbnail}
      <p>{item.description}</p>
      <p>£{item.price}</p>
    </div>
  );
}

export default function Checkout() {
  const [basketData, setBasketData] = useState(null);
  const [cookies, setCookie] = useCookies(["basket"]);
  const navigate = useNavigate();

  useEffect(() => {
    let basket = cookies.basket;
    if (!Array.isArray(basket)) {
      // Nothing in basket, redirect to home
      navigate("/");
      return;
    }

    var payload = {items: [], sets: []};
    for (let i = 0; i < basket.length; i++) {
      if (basket[i]["type"] === "item") {
        payload.items.push(basket[i]["id"]);
      } else if (basket[i]["type"] === "set") {
        payload.sets.push(basket[i]["id"]);
      }
    }

      axios.post(api + "/checkout", payload)
      .then((response) => {
        console.log(response.data);
        setBasketData(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }, [])

  if (basketData !== null && basketData.items !== null) {
    var checkoutItems = null;
    var checkoutItems = basketData.items.map((item) => {
      return <CheckoutItem item={item} key={item.id} />;
    })
  }

  // ditto for sets

  return (
    <div id="checkout">
      <AddressForm />
      <PaymentForm />
      <div>
        {checkoutItems}
        {/* if total is different to subtotal: */}
        <hr/>
        <p>Subtotal £00.00</p>
        <p className="red">You have saved £00.00!</p>
        {/* end */}
        <hr/>
        <p>Total £{basketData !== null ? basketData.total_price : ""}</p>
      </div>
    </div>
  );
};