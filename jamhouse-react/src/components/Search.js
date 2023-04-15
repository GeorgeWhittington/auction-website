import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import ItemList from "./ItemList"
import { api } from "../constants";
import "./Search.css";

function SearchForm() {
  let [minimised, setMinimised] = useState(true);

  function handleMenuPress(event) {
    // Only accept Enter or Space keypresses
    if (!(event.code === "Space" || event.code === "Enter")) {
      return;
    }
    if (event.code === "Space") {
      // Stop page scroll from pressing space
      // event.stopPropagation();
      event.preventDefault();
    }
    handleMenuClick();
  }

  function handleMenuClick() {
    setMinimised((prev_minimised) => {return !prev_minimised});
  }

  let icon = minimised ? faChevronDown : faChevronUp;
  let mobileSettings = <FontAwesomeIcon icon={icon} className="desktop-hidden"/>

  return (
    <div id="search-form">
      <div id="mobile-toggle" onClick={handleMenuClick} onKeyDown={handleMenuPress} tabIndex="0">
        <p>Advanced Settings</p>
        { mobileSettings }
      </div>

      <form id="advanced-options" className={minimised ? "" : "mobile-maximised"}>
        <label>Price Range</label>
        <div className="minmax">
          <label htmlFor="min-price">Min</label>
          <div className="input-icon">
            <input type="number" id="min-price" name="min-price" min="0" step="0.01"></input>
            <i>£</i>
          </div>
          <label htmlFor="max-price">Max</label>
          <div className="input-icon">
            <input type="number" id="max-price" name="max-price" min="0" step="0.01"></input>
            <i>£</i>
          </div>
        </div>

        <label htmlFor="sort-by">Sort By</label>
        <select id="sort-by" name="sort-by">
          {/* Relevence sorting would require proper search indexing, todo if there's time later */}
          {/* <option value="relevant">Most Relevant</option> */}
          <option value="new">Newest</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </form>
    </div>);
}

function Search() {
  let [state, setState] = useState({
    hasMore: true,
    searchParams: {query: "table"},
    items: [{description: "19th Century Fox", image: "http://localhost:8000/media/fox.jpg", price: 99.0, id: 1}]
  });
  let [searchParams, setSearchParams] = useSearchParams();
  let items = [];

  useEffect(() => {
    axios.get(api + "/search", { params: state.searchParams})
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    })
  }, [])

  function fetchMoreSearch() {
    setState({...state, hasMore: false});
  }

  function refreshSearch() {
  }

  return (
    <>
      <SearchForm />
      <div className="search-input">
        <div className="input-icon">
          <input type="text"></input>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>
      <InfiniteScroll
        dataLength={state.items.length}
        next={fetchMoreSearch}
        hasMore={state.hasMore}
        loader={<h4>Loading...</h4>}
        // decide if should use built in refresh functionality
      >
        <ItemList items={state.items} />
      </InfiniteScroll>
    </>
  );
}

export default Search;