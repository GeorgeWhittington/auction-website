import { useParams } from "react-router-dom";

function Item() {
    const { id } = useParams();

    return (
        <div>
            <h2>Item: {id}</h2>
            <p>The data for a specific item, getting this info from the rest api</p>
        </div>
    );
}

export default Item;