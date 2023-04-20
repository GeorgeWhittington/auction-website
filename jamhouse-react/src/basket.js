import { hours24 } from "./constants";

const clearedBasket = {items: [], sets: []};

function testBasketValid(basket) {
    return basket !== undefined && basket.hasOwnProperty("items") && basket.hasOwnProperty("sets")
}

function addToBasket(basket, setCookie, id, type, setOrItem) {
    if (!testBasketValid(basket)) {
        basket = clearedBasket;
    }

    // TODO: remove item check once api updated and sets have this too
    if (type === "item" && setOrItem.sold === true) {
        return "sold";
    }

    if (type === "set") {
        if (basket.sets.includes(String(id))) {
            return "duplicate";
        }

        // check if an item in the set is already in basket
        for (let i = 0; i < setOrItem.items.length; i++) {
            if (basket.items.includes(String(setOrItem.items[i]))) {
                return "contains";
            }
        }

        basket.sets.push(id);
    } else if (type === "item") {
        if (basket.items.includes(String(id))) {
            return "duplicate";
        }

        // check if a set containing this item is already in basket
        for (let i = 0; i < setOrItem.sets.length; i++) {
            if (basket.sets.includes(String(setOrItem.sets[i]))) {
                return "contains";
            }
        }

        basket.items.push(id);
    }

    setCookie("basket", basket, {path: "/", maxAge: hours24});
    return true;
}

function removeFromBasket(basket, setCookie, id, type) {
    if (!testBasketValid(basket)) {
        setCookie("basket", clearedBasket, {path: "/", maxAge: hours24});
        return;
    }

    let newBasket = clearedBasket;

    for (let i = 0; i < basket.items.length; i++) {
        if (`${type}s` === "items" && basket.items[i] == id) {
            continue;
        }
        newBasket.items.push(basket.items[i]);
    }
    for (let i = 0; i < basket.sets.length; i++) {
        if (`${type}s` === "sets" && basket.sets[i] == id) {
            continue;
        }
        newBasket.sets.push(basket.sets[i]);
    }

    setCookie("basket", newBasket, {path: "/", maxAge: hours24});
}

export { addToBasket, removeFromBasket, testBasketValid };