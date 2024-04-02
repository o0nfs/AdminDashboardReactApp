import React, {useEffect} from 'react'
import './Menu.css'
import { FaDelicious , FaWallet , FaChartLine , FaRegClock} from "react-icons/fa6";
import { FaShoppingBag , FaCog, FaSignOutAlt} from "react-icons/fa";

function Menu() {

useEffect(()=>{

},[])

  return <menu>
   
     <ul id="mainMenu">
        <Icon icon={<FaShoppingBag/>} />
        <Icon icon={<FaDelicious/>} />
        <Icon icon={<FaWallet/>} />
        <Icon icon={<FaChartLine/>} />
        <Icon icon={<FaRegClock/>} />
     
       
     </ul>
     <ul id="lastMenu">
       <Icon icon={<FaCog/>} />
       <Icon icon={<FaSignOutAlt/>}/>
     </ul>
  </menu>
}
const Icon= ({ icon } )=> (
    <li>
        <a href='#'>{icon}</a>
    </li>
);

export default Menu
