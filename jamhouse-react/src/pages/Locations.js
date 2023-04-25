import { useParams, useSearchParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Locations.css"
import { addToBasket } from "../basket";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../constants";
import HorizontalDisplay from "../components/HorizontalDisplay";

function Locations() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        axios.get(api + "/repositories/")
        .then((response) => {
            console.log(response.data);
            setLocations(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    var horizontalDisplays = [];

    for (let location of locations) {
        horizontalDisplays.push(<HorizontalDisplay items={location.items} title={"View " + location.name} />);
    }
    

    return (
        <div id="location-page">
            {horizontalDisplays}
        </div>
    );
}

export default Locations;