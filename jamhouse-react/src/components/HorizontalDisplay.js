import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./HorizontalDisplay.css";

function ImageIcon({ item }) {
  var image = null;
  var thumbnail = null;
  var type = "/item/";

  // see if this is a set
  if (item.hasOwnProperty("items")) {
    type = "/set/";
    for (const setItem of item.items) {
      if (setItem.images.length !== 0) {
        image = setItem.images[0];
        break;
      }
    }
  } else {
    if (item.images.length !== 0) {
      image = item.images[0]
    }
  }

  if (image !== null) {
    thumbnail = <img src={image.img} alt={image.alt} />
  } else {
    thumbnail = <FontAwesomeIcon icon={faImage} />
  }

  return (
    <Link
      className="horizontal-image-icon"
      to={type + item.id}
    >
      {thumbnail}
      <p>{item.description}</p>
    </Link>
  )
}

export default function HorizontalDisplay({ items, title }) {
  if (items === null || items.length === 0) {
    return <></>
  }

  return (
    <div className="horizontal-display">
      <h2>{title}</h2>
      <div>
        {
          items.map((item) => <ImageIcon key={item.id} item={item} />)
        }
      </div>
    </div>
  )
}