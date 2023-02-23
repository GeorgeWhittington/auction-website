import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import Search from "./components/Search";
import Item from "./components/Item";
import Set from "./components/Set";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
      </nav>

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