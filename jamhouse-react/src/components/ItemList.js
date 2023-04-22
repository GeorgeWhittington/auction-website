import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage  } from "@fortawesome/free-solid-svg-icons";

import "./ItemList.css"

export default function ItemList({ items }) {
  //console.log('items', items[0].price.toFixed(2))
  return (
    <>
      {items.map((item, index) => (
        <div className="item-list-item" key={item.id}>
          { item.image !== undefined ?
            <img src={item.image} alt={item.alt_text}/> :
            <FontAwesomeIcon icon={faImage} />
          }
          <div className="item-list-details">
            <h2>{item.description}</h2>
            <p>£{parseFloat(item.price).toFixed(2)}</p>
          </div>
          <Link to={`/item/${item.id}`}>View Details</Link>
        </div>
      ))}
    </>
  );
}