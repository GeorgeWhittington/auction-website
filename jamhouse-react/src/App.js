import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./components/Home";
import Search from "./components/Search";
import Item from "./components/Item";
import Set from "./components/Set";

function App() {
  return (
    <Router>
      <header>
        <div id="upper-header">
          <img id="logo" src="./jam-house-logo.png"/>
          <div id="login-options">
            {/* Split the login/register vs welcome {username}!/logout section into a component */}
            <a href="#">Login</a>
            <a href="#">Register</a>
          </div>
          <div id="search-box">
            <input type="text" placeholder="Search"></input>
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
    </Router>
  );
}

export default App;