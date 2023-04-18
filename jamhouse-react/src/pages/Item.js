import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

import { addToBasket } from "../basket";

function Item() {
  const { id } = useParams();
  const [cookies, setCookie] = useCookies(["basket"]);

  function handleBasketClick() {
    let basket = cookies.basket;
    console.log(basket);

    addToBasket(basket, setCookie, id, "item");
  }

  return (
    <div>
      <h2>Item: {id}</h2>
      <p>The data for a specific item, getting this info from the rest api</p>
      <a href="#" onClick={handleBasketClick}>Add to basket</a>
    </div>
  );
}

export default Item;