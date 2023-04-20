const api = "http://localhost:8000/api";
const hours24 = 24 * 60 * 60;
const numberRegex = /^\d+$/;
const currentYear = new Date().getFullYear();

const checkoutStatus = {
    "SUCCESS":0,
    "ITEMS_ALREADY_PURCHASED":1,
    "SETS_PURCHASED":2,
    "ADDR_INVALID_EMAIL":10,
    "ADDR_INVALID_NAME":11,
    "CARD_INVALID_NUMBER":20,
    "CARD_INVALID_EXP":21,
    "CARD_INVALID_CVC":22
}

export { api, hours24, numberRegex, currentYear, checkoutStatus };