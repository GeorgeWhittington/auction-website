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

const numberRegex = /^\d+$/;
const currentYear = new Date().getFullYear();

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

function FormErrors({ error }) {
  return (
    <>
    {error.messages.length !== 0 ?
      <div>
        {error.messages.map((error, index) => {
          return <p key={index} className="red">{error}</p>;
        })}
      </div>
    : ""}
    </>
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

function PaymentForm({ paymentData, error, setPaymentData, handlePaymentSubmit }) {
  function testEmptyOrNumeric(value) {
    return value === "" || numberRegex.test(value);
  }

  function handleCardNumberChange(e) {
    if (testEmptyOrNumeric(e.target.value)) {
      setPaymentData((prevData) => {
        return {...prevData, cardNumber: e.target.value};
      });
    }
  }

  function handleExpiryMonthChange(e) {
    if (!testEmptyOrNumeric(e.target.value)) {
      return;
    }
    if (Number(e.target.value) > 31) {
      return;
    }

    setPaymentData((prevData) => {
      return {...prevData, expirationMonth: e.target.value};
    });
  }

  function handleExpiryYearChange(e) {
    if (!testEmptyOrNumeric(e.target.value)) {
      return;
    }
    if (e.target.value.length === 2 && Number(`20${e.target.value}`) < currentYear) {
      return;
    }

    setPaymentData((prevData) => {
      return {...prevData, expirationYear: e.target.value};
    });
  }

  function handleSecurityCodeChange(e) {
    if (!testEmptyOrNumeric(e.target.value)) {
      return;
    }

    setPaymentData((prevData) => {
      return {...prevData, securityCode: e.target.value};
    });
  }

  return (
    <div id="payment-form">
      <FormErrors error={error} />
      <span>Payment Information</span>
      <form>
        <input
          type="text" placeholder="Card Number"
          value={paymentData.cardNumber}
          onChange={handleCardNumberChange}
          className={error.invalidFields.includes("cardNumber") ? "form-error" : ""}
          maxLength={19} />
        <input
          type="text" placeholder="Cardholder Name"
          value={paymentData.name}
          onChange={(e) => {setPaymentData((prevData) => {return {...prevData, name: e.target.value}})}}
          className={error.invalidFields.includes("name") ? "form-error" : ""} />
        <div className="expiry-input">
          <input
            type="text" placeholder="MM"
            value={paymentData.expirationMonth}
            onChange={handleExpiryMonthChange}
            className={error.invalidFields.includes("expirationMonth") ? "form-error" : ""}
            maxLength={2} />
          <span>/</span>
          <input
            type="text" placeholder="YY" value={paymentData.expirationYear}
            onChange={handleExpiryYearChange} maxLength={2}
            className={error.invalidFields.includes("expirationYear") ? "form-error" : ""}/>
        </div>
        <input
          type="text" placeholder="Security Code"
          value={paymentData.securityCode} onChange={handleSecurityCodeChange}
          maxLength={3} className={error.invalidFields.includes("securityCode") ? "form-error" : ""} />
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
      <FormErrors error={error} />
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

  function handlePaymentSubmit(e) {
    console.log(paymentData);
    var err = {messages: [], invalidFields: []};

    for (const [key, value] of Object.entries(paymentData)) {
      if (value === "") {
        err.invalidFields.push(key);
        if (!err.messages.includes("Please fill all fields")) {
          err.messages.push("Please fill all fields");
        }
      }
    }

    if (err.invalidFields.length !== 0) {
      setPaymentError(err);
      return;
    } else {
      setPaymentError({messages: [], invalidFields: []});
    }

    // form is valid, continue
    setPaymentMinimised(true);
    // display a confirm order button?
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
  const paymentForm = <PaymentForm
    paymentData={paymentData} error={paymentError}
    setPaymentData={setPaymentData}
    handlePaymentSubmit={handlePaymentSubmit} />

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