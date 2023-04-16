import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  createSearchParams,
  useLocation
} from "react-router-dom";
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
  // Specifying re-render when 'access-token' changes
  const [cookies, setCookie] = useCookies(["access-token"]);
  const [state, setState] = useState({
    user: null,
    menuHidden: true
  });
  const navigate = useNavigate();
  const location = useLocation();

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

    setState(prevState => {
      return {...prevState, menuHidden: !prevState.menuHidden}
    });
  }

  function handleSearch(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formJson = Object.fromEntries(formData.entries());

    navigate({
      pathname: "search",
      search: `?${createSearchParams(formJson)}`
    })
  }

  useEffect(() => {
    // TODO: Consider moving this logic elsewhere
    if (cookies["access-token"] === null) {
      if (state.user !== null) {
        setState({...state, user: null});
      }
    } else {
      axios.get(api + "/me", {headers: {"Authorization": `Token ${cookies["access-token"]}`}})
      .then((response) => {
        setState({...state, user: response.data});
      })
    }
  }, [])  // Empty array ensures this only runs *once*

  return (
    <div>
      <header>
        <div id="upper-header">
          <Link to="/">
            <img id="logo" src="./jam-house-logo.png"/>
          </Link>
          <div id="header-right">
            <LoginLogoutRegister username={state.user ? state.user.username : null} />
            <form id="search-box" onSubmit={handleSearch}>
              <input name="query" type="text" placeholder="Search"
                     disabled={ location.pathname === "/search" }
              ></input>
              <button form="search-box" type="submit"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </form>
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
    </div>
  );
}

export default App;