import { useParams } from "react-router-dom";
import {api} from "../constants";
import {useState, useEffect} from 'react';


function Item() {
  const {id} = useParams();
  const [error, setError] = useState(null);
  const [loaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState();
  

  useEffect(() => {
    fetch(api+`/items/${id}`+'/')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  //handle errors 
  if (error) {
    return <div>Error: {error.message}</div>;
  } 

  if (loaded){
    return (
    
    <div key= {items.id}>

    <h2><center>{items.description}</center></h2>
    <p>Item price: {items.price}</p>
    <p>Item ID: {id}</p>
    <p>Description: {items.sold ?'Sold' : 'Not Sold'}</p>
    </div>
      
    );
  }
}




export default Item;
