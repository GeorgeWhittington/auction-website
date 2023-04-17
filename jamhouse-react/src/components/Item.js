//rio rivers - 20018655

import { useParams,Link } from "react-router-dom";
import {api} from "../constants";
import {useState, useEffect} from 'react';
import "./Item.css"
import { faImage  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaArrowAltCircleLeft,FaArrowAltCircleRight } from "react-icons/fa";




function Item() {
  const {id} = useParams();
  const [error, setError] = useState(null);
  const [loaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState();

  useEffect(() => {
    fetch(api+`/items/${id}`+'/')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItem(result);
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
    console.log(item);
    return (
    <div key= {item.id}>
      <div className="desc">
        <h2><center>{item.description}</center></h2>
      </div>
    
    <Image images={item.images} />
    <SoldButton itemSold={item.sold} />
    <SetButton itemSet={item.sets} />
    <div className="itemInfo">
        <p>£{item.price}</p>
        <p>{item.sets}</p>
        <p>http://localhost:8000/api/repositories/1/</p>
        <p>test</p>
    </div>
    {/* <p>Item price: {items.price}</p>
    <p>{items.images[0].img}</p>
    <p>Description: {items.sold ?'Sold' : 'Not Sold'}</p>  */}
    </div>
    );
  }
}

function SetButton({itemSet}){
  if ( itemSet.length !== 0){
    return (
      <div className="setButton">
        <form action='/Set/{itemSet}'>
        <input type ='submit' value='View item in set' />
        </form>
      </div>
    
    );

  }
}

function Image({ images }){

  const imgArray = images
  const [curr, setCurrent] = useState(0)
  const len = images.length
  const prev = () =>{
    setCurrent( curr == 0? len -1 :curr -1)
  }
  const next = () =>{
    setCurrent(curr == len-1? 0 : curr+1)
  }

  if ( imgArray.length == 0){
    return (
    <div className="item-image">
    <FontAwesomeIcon icon={faImage} />
    </div>)
  }else if (imgArray.length == 1){
    return (
      <div className="item-image">
      <img src={images[0].img} />
      </div>)
    
  }else{
    return(
      <div className='slides'>
        <FaArrowAltCircleLeft className='leftArr' onClick={prev} />
        <FaArrowAltCircleRight className='rightArr' onClick={next}/>
        <div className='imagesInArray'>
          {imgArray.map((image,i) =>{
            return(
              <div className={i == curr ? 'image active' : 'image'} key ={i}>
                {i == curr && (<img src={image.img} />)}  
              </div>
            ) 
          })}
        </div>
      </div>
    );

  }
}



function SoldButton({itemSold}){


  if (itemSold !== false) {
    var options = <button disbaled>Item unavailable</button>;
    


    //<Link to={`/item/2`}>View Details</Link>;
      
    
  } else {
    var options = 
    <form action='http://localhost:3000/Item/2'>
      <input type ='submit' value='Add to cart' />
    </form>
  }

  return (

    
    <div className="buttonOptions">
      {options}
    </div>
  )  
}


export default Item;