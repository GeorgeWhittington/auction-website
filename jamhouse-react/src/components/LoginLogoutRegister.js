import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketShopping } from "@fortawesome/free-solid-svg-icons";

export default function LoginLogoutRegister({ username }) {
  console.log(username);
  if (username !== null) {
    var options = <><a href="#">Welcome {username}!</a><a href="#">Logout</a></>;
  } else {
    var options = <><a href="#">Login</a><a href="#">Register</a></>;
  }

  return (
    <div id="login-options">
      {options}
      <a href="#"><FontAwesomeIcon icon={faBasketShopping} /></a>
    </div>
  )
  }