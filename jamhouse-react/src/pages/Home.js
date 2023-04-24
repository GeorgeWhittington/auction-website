import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import { api } from "../constants";
import "./Home.css";

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

function HorizontalDisplay({ items, title }) {
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

function Home() {
  const [sets, setSets] = useState(null);
  const [coins, setCoins] = useState(null);
  const [chairs, setChairs] = useState(null);
  const [recentlySold, setRecentlySold] = useState(null);

  useEffect(() => {
    axios.get(api + "/sets/")
    .then((response) => {
      let unsoldSets = [];
      for (const set of response.data) {
        if (set.sold === false) {
          unsoldSets.push(set);
        }
      }
      setSets(unsoldSets.slice(0, 5));
    }).catch((error) => {
      console.log(error);
    })

    axios.get(api + "/search", {params: {query: "coin"}})
    .then((response) => {
      setCoins(response.data.results.slice(0, 5))
    }).catch((error) => {
      console.log(error);
    })

    axios.get(api + "/search", {params: {query: "chair"}})
    .then((response) => {
      setChairs(response.data.results.slice(0, 5))
    }).catch((error) => {
      console.log(error);
    })

    axios.get(api + "/recently-sold")
    .then((response) => {
      setRecentlySold(response.data.results.slice(0, 5))
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  return (
    <div>
      <h1>Welcome to Jamhouse Auction House</h1>
      <HorizontalDisplay items={sets} title={"Buy Sets"} />
      <HorizontalDisplay items={coins} title={"Buy Coins"} />
      <HorizontalDisplay items={chairs} title={"Buy Chairs"} />
      <HorizontalDisplay items={recentlySold} title={"Recently Sold"} />
    </div>
  );
}

export default Home;