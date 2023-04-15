import { Link } from "react-router-dom";

import "./ItemList.css"

export default function ItemList({ items }) {
  return (
    <>
      {items.map((item, index) => (
        <div className="item-list-item" key={item.id}>
          <img src={item.image}/>
          <div className="item-list-details">
            <h2>{item.description}</h2>
            <p>£{item.price.toFixed(2)}</p>
          </div>
          <Link to={`/item/${item.id}`}>View Details</Link>
        </div>
      ))}
    </>
  );
}