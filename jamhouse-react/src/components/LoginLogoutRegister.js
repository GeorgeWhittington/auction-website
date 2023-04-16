import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

export default function LoginLogoutRegister({ username }) {

  const[cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  function logout() {
    removeCookie(['access-token']);
    navigate(0); // reload
  }

  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#" onClick={logout}>Logout</a></>;
  } else {
    var options = <><Link to="/login">Login</Link><a href="#">Register</a></>;
  }

  return (
    <div id="login-options">
      {options}
      <a href="#"><FontAwesomeIcon icon={faBasketShopping} /></a>
    </div>
  )
}
