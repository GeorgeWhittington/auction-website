import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

import ItemList from "../components/ItemList";
import { api } from "../constants";

export default function RecentlySold() {
  const [hasMore, setHasMore] = useState(true);
  const [next, setNext] = useState(1);
  const [items, setItems] = useState([]);

  function fetchRecentlySoldItems() {
    axios.get(api + "/recently-sold", { params: {page: next} })
    .then((response) => {
      if (response.data.next === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNext(response.data.next);
      }

      var results = []
      response.data.results.forEach((result) => {
        let item = {
          id: result.id,
          price: Number(result.price),
          description: result.description
        }

        try {
          item.image = result.images[0].img;
          item.alt = result.images[0].alt;
        } catch (error) {}

        results.push(item);
      });
      setItems((prevItems) => {return prevItems.concat(results)});
    }).catch((error) => {
      console.log(error);
    })
  }

    useEffect(() => {fetchRecentlySoldItems()}, [])

    return (
      <>
        <h2>Recently Sold Items</h2>
        <InfiniteScroll
          dataLength={items.length}
          next={fetchRecentlySoldItems}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <ItemList items={items} />
        </InfiniteScroll>
      </>
    );
}