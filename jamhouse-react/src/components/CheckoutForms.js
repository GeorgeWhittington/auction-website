import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import { numberRegex, currentYear } from "../constants"

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

const fieldNames = {
  email: "Email", fName: "First Name",
  lName: "Last Name", address: "Address",
  city: "City/Town", county: "County/State",
  postcode: "Postcode"
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

export { MinimiseableForm, PaymentForm, AddressForm }