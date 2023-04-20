import { hours24 } from "./constants";

const clearedBasket = {items: [], sets: []};

function testBasketValid(basket) {
    return basket !== undefined && basket.hasOwnProperty("items") && basket.hasOwnProperty("sets")
}

function addToBasket(basket, setCookie, id, type, setOrItem) {
    // sanity check, don't allow an item when it's set is already selected

    if (!testBasketValid(basket)) {
        basket = clearedBasket;
    }

    if (type === "set") {
        if (id in basket.sets) {
            return;
        }

        // check validity
        const items = setOrItem.items;

        basket.sets.push(id);
    } else if (type === "item") {
        if (id in basket.items) {
            return;
        }

        // check validity

        basket.items.push(id);
    }

    setCookie("basket", basket, {path: "/", maxAge: hours24});
}

function removeFromBasket(basket, setCookie, id, type) {
    if (!testBasketValid(basket)) {
        setCookie("basket", clearedBasket, {path: "/", maxAge: hours24});
        return;
    }

    let newBasket = clearedBasket;

    for (let i = 0; i < basket.items.length; i++) {
        if (`${type}s` == "items" && basket.items[i] == id) {
            continue;
        }
        newBasket.items.push(basket.items[i]);
    }
    for (let i = 0; i < basket.sets.length; i++) {
        if (`${type}s` == "sets" && basket.sets[i] == id) {
            continue;
        }
        newBasket.sets.push(basket.sets[i]);
    }

    setCookie("basket", newBasket, {path: "/", maxAge: hours24});
}

export { addToBasket, removeFromBasket, testBasketValid };