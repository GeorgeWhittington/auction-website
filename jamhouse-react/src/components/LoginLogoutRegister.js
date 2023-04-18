import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

import "./LoginLogoutRegister.css";

export default function LoginLogoutRegister({ username, basketLength }) {

  const[cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  function logout() {
    removeCookie(['access-token']);
    navigate(0); // reload
  }

  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#" onClick={logout}>Logout</a></>;
  } else {
    var options = <><Link to="/login">Login</Link><Link to="/register">Register</Link></>;
  }

  var basket = basketLength !== 0 ? ` (${basketLength})` : "";

  return (
    <div id="login-options">
      {options}
      <Link to="/checkout"><FontAwesomeIcon icon={faBasketShopping} />{basket}</Link>
    </div>
  )
}
