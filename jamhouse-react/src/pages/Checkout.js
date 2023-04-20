import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";

import "./Checkout.css";
import { api, hours24 } from "../constants";
import { clearedBasket, removeFromBasket, testBasketValid } from "../basket";
import { MinimiseableForm, PaymentForm, AddressForm } from "../components/CheckoutForms";
import { handlePress } from "../accessibleClick";

function CheckoutItem({ item, type }) {
  const [cookies, setCookie] = useCookies(["basket"]);

  function handleRemovePress(e) {
    handlePress(e, handleRemoveClick);
  }

  function handleRemoveClick() {
    removeFromBasket(cookies["basket"], setCookie, item.id, type);
  }

  if (item.hasOwnProperty("images") && item.images.length !== 0) {
    var thumbnail = <img src={item.images[0].img} alt={item.images[0].alt} />
  } else {
    var thumbnail = <FontAwesomeIcon icon={faImage} className="thumbnail" />
  }

  return (
    <div className="checkout-item">
      {thumbnail}
      <p>{item.description}</p>
      <p>£{item.price}</p>
      <div className="checkout-item-remove" onClick={handleRemoveClick} onKeyDown={handleRemovePress} tabIndex={0}>
        <FontAwesomeIcon icon={faX} className="red" />
      </div>
    </div>
  );
}

export default function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [addressData, setAddressData] = useState({
    email: "", fName: "", lName: "",
    address: "", city: "", country: "",
    county: "", postcode: ""
  });
  const [addressError, setAddressError] = useState({
    messages: [], invalidFields: []
  });
  const [addressMinimised, setAddressMinimised] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: "", name: "",
    expirationMonth: "", expirationYear: "",
    securityCode: ""
  });
  const [paymentError, setPaymentError] = useState({
    messages: [], invalidFields: []
  });
  const [paymentMinimised, setPaymentMinimised] = useState(true);
  const [basketLength, setBasketLength] = useState(0);

  const [cookies, setCookie, removeCookie] = useCookies(["basket"]);
  const navigate = useNavigate();

  const basketCookie = cookies["basket"];
  if (!testBasketValid(basketCookie)) {
    if (basketLength !== 0) {
      setBasketLength(0);
    }
  } else {
    let length = basketCookie.items.length + basketCookie.sets.length;
    if (length !== basketLength) {
      setBasketLength(length);
    }
  }

  function handleAddressChange(event, field) {
    setAddressData((prevData) => {
      let newData = {...prevData}
      newData[field] = event.target.value;
      return newData;
    });
  }

  function buyBasket() {
    axios.post(api + "/buy", {...basketCookie, addressData: addressData, paymentData: paymentData})
    .then((response) => {
      console.log(response);
      removeCookie("basket");
      navigate("/post-checkout");
    }).catch((error) => {
      console.log(error);
    })
  }

  function validateForm(data, setError) {
    var err = {messages: [], invalidFields: []}

    for (const [key, value] of Object.entries(data)) {
      if (value === "") {
        err.invalidFields.push(key);
        if (!err.messages.includes("Please fill all fields")) {
          err.messages.push("Please fill all fields");
        }
      }
      if (key === "email" && !value.includes("@")) {
        err.invalidFields.push(key);
        err.messages.push("Please enter a valid email address");
      }
    }

    if (err.invalidFields.length !== 0) {
      setError(err);
      return false;
    } else {
      setError({messages: [], invalidFields: []});
      return true;
    }
  }

  function handleAddressSubmit() {
    const success = validateForm(addressData, setAddressError);
    if (!success) {
      return;
    }

    // form is valid, continue
    setAddressMinimised(true);
    setPaymentMinimised(false);
  }

  function handlePaymentSubmit() {
    const addressSuccess = validateForm(addressData, setAddressError);
    if (!addressSuccess) {
      setAddressMinimised(false);
      setPaymentMinimised(true);
      return;
    }

    const paymentSuccess = validateForm(paymentData, setPaymentError);
    if (!paymentSuccess) {
      setAddressMinimised(true);
      setPaymentMinimised(false);
      return;
    }

    // form is valid, continue
    setAddressMinimised(true);
    setPaymentMinimised(true);

    buyBasket();
  }

  useEffect(() => {
    let basket = cookies.basket;
    if (!testBasketValid(basket) || basket.items.length === 0 && basket.sets.length === 0) {
      // Nothing in basket, redirect to home
      navigate("/");
      return;
    }

    axios.post(api + "/checkout", basket)
    .then((response) => {
      setCheckoutData(response.data);
    }).catch((error) => {
      console.log(error);
      // TODO: check error code, fix basket
    })
  }, [basketLength])

  var checkoutItems = null;
  if (checkoutData !== null && checkoutData.items !== null) {
    checkoutItems = checkoutData.items.map((item) => {
      return <CheckoutItem item={item} key={item.id} type="item" />;
    })
  }

  var checkoutSets = null;
  if (checkoutData !== null && checkoutData.sets !== null) {
    checkoutSets = checkoutData.sets.map((set) => {
      return <CheckoutItem item={set} key={set.id} type={"set"} />;
    })
  }

  var checkoutTotals = null;
  if (checkoutData !== null) {
    const savings = Number(checkoutData.subtotal_price - checkoutData.total_price).toFixed(2);

    checkoutTotals = <>
      {checkoutData.subtotal_price !== checkoutData.total_price ?
        <>
          <hr/>
          <p>Subtotal £{checkoutData.subtotal_price}</p>
          <p className="red">You have saved £{savings}!</p>
        </>
        : ""
      }
      <hr/>
      <p>Total £{checkoutData.total_price}</p>
      <hr className="minimised-desktop"/>
    </>
  }

  const addressForm = <AddressForm
    addressData={addressData} error={addressError}
    handleAddressChange={handleAddressChange}
    handleAddressSubmit={handleAddressSubmit} />
  const paymentForm = <PaymentForm
    paymentData={paymentData} error={paymentError}
    setPaymentData={setPaymentData}
    handlePaymentSubmit={handlePaymentSubmit} />

  // TODO: check error code, render stuff differently?

  return (
    <div id="checkout">
      <div id="checkout-forms">
        <MinimiseableForm minimised={addressMinimised} setMinimised={setAddressMinimised} form={addressForm} title="Address Information" />
        <MinimiseableForm minimised={paymentMinimised} setMinimised={setPaymentMinimised} form={paymentForm} title="Payment Information" />
      </div>
      <div>
        {checkoutItems}
        {checkoutSets}
        {checkoutTotals}
      </div>
    </div>
  );
};