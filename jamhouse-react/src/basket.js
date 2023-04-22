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

    if (type === "item") {
        let index = basket.items.indexOf(String(id));
        basket.items.splice(index, 1);
    } else if (type === "set") {
        let index = basket.sets.indexOf(String(id));
        basket.sets.splice(index, 1);
    }

    setCookie("basket", basket, {path: "/", maxAge: hours24});
}

export { addToBasket, removeFromBasket, testBasketValid, clearedBasket };