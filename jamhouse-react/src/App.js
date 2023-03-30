import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { icon } from "@fortawesome/fontawesome-svg-core/import.macro"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

import Home from "./components/Home";
import Search from "./components/Search";
import Item from "./components/Item";
import Set from "./components/Set";

function LoginLogoutRegister({ username }) {
  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#">Logout</a></>;
  } else {
    var options = <><a href="#">Login</a><a href="#">Register</a></>;
  }

  return (
    <div id="login-options">
      {options}
    </div>
  )
}

function App() {
  let username = null;

  return (
    <Router>
      <header>
        <div id="upper-header">
          <img id="logo" src="./jam-house-logo.png"/>
          <div id="header-right">
            <LoginLogoutRegister username={username} />
            <div id="search-box">
              <input type="text" placeholder="Search"></input>
              <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
            </div>
          </div>
        </div>
        <nav id="lower-header">
          <a href="#">About Us</a>
          <a href="#">Locations</a>
          <a href="#">Recently Sold</a>
          <a href="#">Contact Us</a>

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
    </Router>
  );
}

export default App;