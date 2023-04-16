import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

export default function LoginLogoutRegister({ username }) {

  const[token, setToken, removeToken] = useCookies(['access-token']);
  const navigate = useNavigate();

  function logout() {
    removeToken(['access-token']);
    navigate(0); // reload
  }

  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#" onClick={logout}>Logout</a></>;
  } else {
    var options = <><Link to="/login">Login</Link><Link to="/register">Register</Link></>;
  }

  return (
    <div id="login-options">
      {options}
      <a href="#"><FontAwesomeIcon icon={faBasketShopping} /></a>
    </div>
  )
}
