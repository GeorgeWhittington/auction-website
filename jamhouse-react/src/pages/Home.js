import { useEffect, useState } from "react";
import axios from "axios";

import { api } from "../constants";
import HorizontalDisplay from "../components/HorizontalDisplay";

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