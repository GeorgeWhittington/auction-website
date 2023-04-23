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
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Item from "./pages/Item";
import Set from "./pages/Set";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Profile from './pages/Profile'
import LoginLogoutRegister from "./components/LoginLogoutRegister";
import Checkout from "./pages/Checkout";
import PostCheckout from "./pages/PostCheckout";
import Orders from "./pages/Orders";
import { testBasketValid } from "./basket";
import { handlePress } from "./accessibleClick";

function App() {
  const [cookies, setCookie] = useCookies();
  const [accessToken, setAccessToken] = useState(cookies["access-token"]);
  const [user, setUser] = useState(null);
  const [menuHidden, setMenuHidden] = useState(true);
  const [basketLength, setBasketLength] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const accessTokenCookie = cookies["access-token"];
  if (accessToken != accessTokenCookie) {
    setAccessToken(accessTokenCookie);
  }

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

  function handleMenuPress(e) {
    handlePress(e, handleMenuClick);
  }

  function handleMenuClick() {
    if (window.innerWidth > 500) {
      return;
    }

    setMenuHidden((prevMenuHidden) => {return !prevMenuHidden});
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
    if (accessToken === null) {
      if (user !== null) {
        setUser(null);
      }
    } else {
      axios.get(api + "/me", {headers: {"Authorization": `Token ${accessToken}`}})
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {})
    }
  }, [accessToken])

  return (
    <div>
      <header>
        <div id="upper-header">
          <Link to="/">
            <img id="logo" src={process.env.PUBLIC_URL+'/jam-house-logo.png'}/>
          </Link>
          <div id="header-right">
            <LoginLogoutRegister username={user ? user.username : null} basketLength={basketLength} />
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
          { user ? <Link to={"/orders"} className={menuHidden ? "hidden" : ""}>Your Orders</Link> : <></> }
          <Link to={"/about-us"} className={menuHidden ? "hidden" : ""}>About Us</Link>
          <a href="#" className={menuHidden ? "hidden" : ""}>Locations</a>
          <a href="#" className={menuHidden ? "hidden" : ""}>Recently Sold</a>
          <Link to={"/contact-us"} className={menuHidden ? "hidden" : ""}>Contact Us</Link>
        </nav>
      </header>
      <div id="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/set/:id" element={<Set />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/post-checkout" element={<PostCheckout />} />
        </Routes>
      </div>
      <div id="footer">
        <a href="http://localhost:8000/media/jamhouse-cookie-policy.pdf">Cookies</a>
        <a href="http://localhost:8000/media/jamhouse-privacy-policy.pdf">Privacy Policy</a>
      </div>
    </div>
  );
}

export default App;