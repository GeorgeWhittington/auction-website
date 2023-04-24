import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import ItemList from "../components/ItemList"
import { api } from "../constants";
import "./Search.css";
import { handlePress } from "../accessibleClick";

function SearchForm({ minPrice, maxPrice, sortBy, handleParamChange }) {
  let [minimised, setMinimised] = useState(true);

  function handleMenuPress(e) {
    handlePress(e, handleMenuClick);
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
        <label htmlFor="min-price">Minimum Price</label>
        <div>
          <div className="input-icon">
            <input type="number" id="min-price" name="min-price" min="0" step="0.01"
                    value={minPrice !== null ? minPrice : ""} onChange={handleParamChange}></input>
            <i>£</i>
          </div>
        </div>
        <label htmlFor="max-price">Maximum Price</label>
        <div>
          <div className="input-icon">
            <input type="number" id="max-price" name="max-price" min="0" step="0.01"
                    value={maxPrice !== null ? maxPrice : ""} onChange={handleParamChange}></input>
            <i>£</i>
          </div>
        </div>

        <label htmlFor="sort-by">Sort By</label>
        <select id="sort-by" name="sort-by"
                value={sortBy !== null ? sortBy : "new"}
                onChange={handleParamChange}>
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
  let [queryString, setQueryString] = useSearchParams();
  let [hasMore, setHasMore] = useState(true);
  let [next, setNext] = useState(1);
  let [searchParams, setSearchParams] = useState({
    query: queryString.get("query"),
    "min-price": queryString.get("min-price"),
    "max-price": queryString.get("max-price"),
    "sort-by": queryString.get("sort-by")
  });
  let [items, setItems] = useState([]);

  function fetchSearch() {
    let parameters = searchParams
    parameters.page = next;

    if (!parameters.query) {
      return;
    }

    axios.get(api + "/search", { params: parameters })
    .then((response) => {
      console.log(response.data);

      if (response.data.next === null) {
        setHasMore(false);
      } else {
        setHasMore(true);
        setNext(response.data.next);
      }

      var results = [];
      response.data.results.forEach(result => {
        let item = {
          id: result.id,
          price: Number(result.price),
          description: result.description
        }

        try {
          item.image = result.images[0].img;
          item.alt_text = result.images[0].alt;
        } catch (error) {}

        results.push(item);
      });
      setItems((prevItems) => {return prevItems.concat(results)});
    })
    .catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {fetchSearch()}, [searchParams])

  function handleQueryChange(event) {
    // provide callback to function that triggers ajax request
    setSearchParams({...searchParams, query: event.target.value});
    setItems([]);
    setNext(1);
  }

  function checkNumber(value) {

  }

  function handleParamChange(event) {
    let filter = event.target.id;
    let value = event.target.value;

    if (filter === "min-price" || filter == "max-price" && Number(value) < 0) {
      value = "0"
    }

    if (filter === "min-price") {
      setSearchParams({...searchParams, "min-price": event.target.value});
    } else if (filter === "max-price") {
      setSearchParams({...searchParams, "max-price": event.target.value});
    } else if (filter === "sort-by") {
      setSearchParams({...searchParams, "sort-by": event.target.value});
    }
    setItems([]);
    setNext(1);
  }

  return (
    <div id="search-wrapper">
      <SearchForm
        minPrice={searchParams["min-price"]}
        maxPrice={searchParams["max-price"]}
        sortBy={searchParams["sort-by"]}
        handleParamChange={handleParamChange} />
      <div className="search-input">
        <div className="input-icon">
          <input type="text" value={searchParams.query} onChange={handleQueryChange}></input>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </div>
      </div>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchSearch}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <ItemList items={items} />
      </InfiniteScroll>
    </div>
  );
}

export default Search;