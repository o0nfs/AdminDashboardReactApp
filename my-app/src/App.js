
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import Admin from './Components/LoginSignup/Admin'
import {Route , Routes, Navigate} from "react-router-dom"
import Menu from './Components/Menu';
import Create from './Components/Create';
import Update from './Components/Update';
import Read from './Components/Read';
import Home from './Components/Home';
import 'bootstrap/dist/css/bootstrap.min.css'
import { CookiesProvider, useCookies } from 'react-cookie'


function App() {
 
  const [cookies, setCookie] = useCookies(['user'])

  function handleLogin(user) {
    setCookie('user', user, { path: '/' })
  }
  return (

    <div>

    <CookiesProvider>
      {
        cookies.user?
        <Routes>

          <Route path="/Home" element={<Home />}  /> 
          <Route path="/Admin" element={<Admin />}  /> 
          <Route path="/Menu" element={<Menu />}  /> 
          <Route path="/Create" element={<Create />}  /> 
          <Route path="/update/:id" element={<Update />}  /> 
          <Route path="/read/:id" element={<Read />}  /> 
          <Route path="/" element={<Navigate to ="/Home" />}/>
        </Routes>
        :
        <Routes>
          <Route path="/LoginSignup" element={<LoginSignup onLogin={handleLogin}/>}/>
          <Route path="/*" element={<Navigate to ="/LoginSignup" />}/>
        </Routes>



      }
      
    </CookiesProvider>
  </div>
    
    
   
  );
}

export default App;
