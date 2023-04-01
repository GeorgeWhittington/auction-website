import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./App.css";

import { api } from "./constants";
import Home from "./components/Home";
import Search from "./components/Search";
import Item from "./components/Item";
import Set from "./components/Set";
import LoginLogoutRegister from "./components/LoginLogoutRegister";

function App() {
  // Once access-tokens are implemented, specify that cookie inside
  // useCookies so that it changing triggers a re-render
  const [cookies, setCookie] = useCookies();
  const [state, setState] = useState({
    username: null,
    menuHidden: true
  });

  function handleMenuPress(event) {
    // Only accept Enter or Space keypresses
    if (!(event.code === "Space" || event.code === "Enter")) {
      return;
    }
    if (event.code === "Space") {
      // Stop page scroll from pressing space
      // event.stopPropagation();
      event.preventDefault();
    }
    handleMenuClick();
  }

  function handleMenuClick() {
    console.log("menu clicked");
    if (window.innerWidth > 500) {
      return;
    }

    setState(prevState => ({username: prevState.username, menuHidden: !prevState.menuHidden}))
  }

  useEffect(() => {
    axios.get(api + "/me")
      .then(function (response) {
        // handle success
        console.log(response);
      })
      .catch(function (error) {
        if (error.status === 401) {
          // Not logged in, ignore
          return;
        }
        // handle error
        console.log(error);
      });
  })

  return (
    <Router>
      <header>
        <div id="upper-header">
          <img id="logo" src="./jam-house-logo.png"/>
          <div id="header-right">
            <LoginLogoutRegister username={state.username} />
            <div id="search-box">
              <input type="text" placeholder="Search"></input>
              <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </div>
          </div>
        </div>
        <nav id="lower-header">
          <div className="mobile-menu" onClick={handleMenuClick} onKeyDown={handleMenuPress} tabIndex="0"><FontAwesomeIcon icon={faBars} /></div>
          <a href="#" className={state.menuHidden ? "hidden" : ""}>About Us</a>
          <a href="#" className={state.menuHidden ? "hidden" : ""}>Locations</a>
          <a href="#" className={state.menuHidden ? "hidden" : ""}>Recently Sold</a>
          <a href="#" className={state.menuHidden ? "hidden" : ""}>Contact Us</a>
          {/* <Link to="/">Home</Link>
          <Link to="/search">Search</Link> */}
        </nav>
      </header>
      <div id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/set/:id" element={<Set />} />
          {/* Also need to have:
          - Basket
          - Checkout workflow
          - Login
          - Logout
          - User Profile Page (displaying prev orders/account details)
          - View Repository
          */}
        </Routes>
      </div>
      <div id="footer">
        <a href="#">Cookies</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms & Conditions</a>
      </div>
    </Router>
  );
}

export default App;