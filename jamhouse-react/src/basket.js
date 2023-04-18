import { hours24 } from "./constants";

function addToBasket(basket, setCookie, id, type) {
    if (basket === undefined || !Array.isArray(basket)) {
        basket = [];
    }

    for (let i = 0; i < basket.length; i++) {
        if (basket[i].id === id && basket[i].type === type) {
            // item / set already in basket, ignore
            return;
        }
    }

    basket.push({id: id, type: type});
    setCookie("basket", basket, {path: "/", maxAge: hours24});
}

export { addToBasket };