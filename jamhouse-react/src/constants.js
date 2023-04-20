const api = "http://localhost:8000/api";
const hours24 = 24 * 60 * 60;
const numberRegex = /^\d+$/;
const currentYear = new Date().getFullYear();

export { api, hours24, numberRegex, currentYear };