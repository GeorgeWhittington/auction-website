import { useParams } from "react-router-dom";

function Set() {
    const { id } = useParams();

    return (
        <div>
            <h2>Set: {id}</h2>
            <p>The data for a specific set, getting this info from the rest api</p>
        </div>
    );
}

export default Set;