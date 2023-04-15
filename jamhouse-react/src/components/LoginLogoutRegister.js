import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function LoginLogoutRegister({ username }) {

  const[token, setToken, removeToken] = useCookies(['access-token']);
  const navigate = useNavigate();

  function logout() {
    // TODO: logout on the server too, for now just remove cookie
    removeToken(['access-token']);
    navigate(0); // reload
  }

  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#" onClick={logout}>Logout</a></>;
  } else {
    var options = <><a href="/login">Login</a><a href="#">Register</a></>;
  }

  return (
    <div id="login-options">
      {options}
      <a href="#"><FontAwesomeIcon icon={faBasketShopping} /></a>
    </div>
  )
}