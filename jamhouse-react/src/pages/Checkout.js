import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faChevronDown, faX } from "@fortawesome/free-solid-svg-icons";

import "./Checkout.css";
import { api } from "../constants";
import { removeFromBasket } from "../basket";

const fieldNames = {
  email: "Email", fName: "First Name",
  lName: "Last Name", address: "Address",
  city: "City/Town", county: "County/State",
  postcode: "Postcode"
}

function FormInput({id, addressData, handleAddressChange, error}) {
  let type = id !== "email" ? "text" : "email"

  return (
    <input
      type={type} placeholder={fieldNames[id]} value={addressData[id]}
      onChange={(e) => {handleAddressChange(e, id)}}
      className={error.invalidFields.includes(id) ? "form-error" : ""}
    />
  )
}

function MinimiseableForm({minimised, setMinimised, form, title}) {
  function handleMaximisePress(e) {
    // Only accept Enter or Space keypresses
    if (!(e.code === "Space" || e.code === "Enter")) {
      return;
    }
    if (e.code === "Space") {
      // Stop page scroll from pressing space
      e.preventDefault();
    }
    handleMaximiseClick();
  }

  function handleMaximiseClick() {
    setMinimised(false);
  }

  if (minimised) {
    return (
      <div id="minimised-form" onClick={handleMaximiseClick} onKeyDown={handleMaximisePress} tabIndex={0}>
        <span>{title}</span>
        <FontAwesomeIcon icon={faChevronDown}/>
      </div>
    );
  } else {
    return form;
  }
}

// cardNumber: "", name: "",
//     expirationMonth: "", expirationYear: "",
//     securityCode: ""

function PaymentForm({ paymentData, error }) {
  function handlePaymentSubmit() {

  }

  return (
    <div id="payment-form">
      <span>Payment Information</span>
      <form>
        <input type="text" placeholder="Card Number" maxLength={19} />
        <input type="text" placeholder="Cardholder Name" />
        <div className="month-input">
          <input type="text" placeholder="MM" maxLength={2} />
          <span>/</span>
          <input type="text" placeholder="YY" maxLength={2} />
        </div>
        <input type="text" placeholder="Security Code" maxLength={3} />
        <div>
          <button type="button" onClick={handlePaymentSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

function AddressForm({ addressData, error, handleAddressChange, handleAddressSubmit }) {
  let countryClasses = "";
  if (addressData.country === "") {
    countryClasses += " unselected";
  }
  if (error.invalidFields.includes("country")) {
    countryClasses += " form-error";
  }

  return (
    <div id="address-form">
      {error.messages.length !== 0 ?
        <div>
          {error.messages.map((error, index) => {
            return <p key={index} className="red">{error}</p>;
          })}
        </div>
      : ""}
      <span>Address Information</span>
      <form>
        <FormInput id={"email"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <FormInput id={"fName"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <FormInput id={"lName"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <FormInput id={"address"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <FormInput id={"city"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <select
          value={addressData.country} onChange={(e) => {handleAddressChange(e, "country")}}
          className={countryClasses}>
          <option value="" disabled>Country</option>
          <option value="uk">United Kingdom</option>
          {/* TODO: all countries */}
        </select>
        <FormInput id={"county"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <FormInput id={"postcode"} addressData={addressData} handleAddressChange={handleAddressChange} error={error} />
        <div>
          <button type="button" onClick={handleAddressSubmit}>Submit</button>
        </div>
      </form>
    </div>
  );
}

function CheckoutItem({ item, type }) {
  const [cookies, setCookie] = useCookies(["basket"]);

  function handleRemovePress(e) {
    // Only accept Enter or Space keypresses
    if (!(e.code === "Space" || e.code === "Enter")) {
      return;
    }
    if (e.code === "Space") {
      // Stop page scroll from pressing space
      e.preventDefault();
    }
    handleRemoveClick();
  }

  function handleRemoveClick() {
    removeFromBasket(cookies["basket"], setCookie, item.id, type);
  }

  if (item.images.length !== 0) {
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

  const [cookies, setCookie] = useCookies(["basket"]);
  const navigate = useNavigate();

  const [basketLength, setBasketLength] = useState(0);

  const basketCookie = cookies["basket"];
  if (!Array.isArray(basketCookie)) {
    if (basketLength !== 0) {
      setBasketLength(0);
    }
  } else if (basketCookie.length !== basketLength) {
    setBasketLength(basketCookie.length);
  }

  function handleAddressChange(event, field) {
    setAddressData((prevData) => {
      let newData = {...prevData}
      newData[field] = event.target.value;
      return newData;
    });
  }

  function handleAddressSubmit(e) {
    console.log(addressData);
    var err = {messages: [], invalidFields: []}

    for (const [key, value] of Object.entries(addressData)) {
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
      setAddressError(err);
      return;
    } else {
      setAddressError({messages: [], invalidFields: []})
    }

    // form is valid, continue
    setAddressMinimised(true);
    setPaymentMinimised(false);
  }

  useEffect(() => {
    let basket = cookies.basket;
    if (!Array.isArray(basket) || basket.length === 0) {
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
        setCheckoutData(response.data);
      }).catch((error) => {
        console.log(error);
      })
  }, [basketLength])

  if (checkoutData !== null && checkoutData.items !== null) {
    var checkoutItems = null;
    var checkoutItems = checkoutData.items.map((item) => {
      return <CheckoutItem item={item} key={item.id} type="item" />;
    })
  }

  // ditto for sets

  const addressForm = <AddressForm
    addressData={addressData} error={addressError}
    handleAddressChange={handleAddressChange}
    handleAddressSubmit={handleAddressSubmit} />
  const paymentForm = <PaymentForm paymentData={paymentData} error={paymentError} />

  return (
    <div id="checkout">
      <div id="checkout-forms">
        <MinimiseableForm minimised={addressMinimised} setMinimised={setAddressMinimised} form={addressForm} title="Address Information" />
        <MinimiseableForm minimised={paymentMinimised} setMinimised={setPaymentMinimised} form={paymentForm} title="Payment Information" />
      </div>
      <div>
        {checkoutItems}
        {/* if total is different to subtotal: */}
        <hr/>
        <p>Subtotal £00.00</p>
        <p className="red">You have saved £00.00!</p>
        {/* end */}
        <hr/>
        <p>Total £{checkoutData !== null ? checkoutData.total_price : ""}</p>
        <hr className="minimised-desktop"/>
      </div>
    </div>
  );
};