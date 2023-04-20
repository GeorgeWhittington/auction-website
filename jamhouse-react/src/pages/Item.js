//rio rivers - 20018655

import { useParams,Link } from "react-router-dom";
import {api} from "../constants";
import {useState, useEffect} from 'react';
import "../components/Item.css"
import { faImage, faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios'


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

    let repoName = <></>
    if (item.repositories.length > 0) {
      repoName = <RepoFetch itemRepo={item.repositories[0]}/>
    }

    return (
      <div className="conGrid">
        <div className='infoGrid'>
          <div key= {item.id}>
            <div className="desc">
              <h2><center>{item.description}</center></h2>
            </div>
            
            <div className="itemInfo">
              <p>£{item.price}</p>
              {repoName}

            </div> 

            <div className="bGrid">
              <SoldButton itemSold={item.sold} />
              <SetButton itemSet={item.sets} />
            </div>
          </div>   
        </div>

        <div className="imgGrid">
        <Image images={item.images} />
        </div>
      </div>
    );
  }
}
function SetButton({itemSet}){
  if ( itemSet.length !== 0){
    return (
      <div className="setButton">
        <Link to={`/Set/${itemSet}`} type="submit" className="danbutton">View item in a set</Link>
      </div>
    
    );

  }
}
function RepoFetch(props){
  
  const [repoName, setRepoName] = useState("");

  axios.get(api+`/repositories/${props.itemRepo}/`)
      .then(
        function(response) {
          setRepoName(response.data.name)
        }
      )

  return(
    <div>
    <p>Repository: {repoName}</p>
    </div>
  )

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
        <FontAwesomeIcon icon={faCircleLeft} className="leftArr" onClick={prev} />
        <FontAwesomeIcon icon={faCircleRight} className="rightArr" onClick={next} />
        <div className='imagesInArray'>
          {imgArray.map((image,i) =>{
            return(
              <div className={i == curr ? 'imageActive' : 'image'} key ={i}>
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
    var options = <a href='#' type="submit" className="danbutton" disabled>Sold</a>
    


    //<Link to={`/item/2`}>View Details</Link>;
      
    
  } else {
    var options = 
    <a href='#' type="submit" className="danbutton">Add to cart</a>
  }

  return (

    
    <div className="buttonOptions">
      {options}
    </div>
  )  
}


export default Item;