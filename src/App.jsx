import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import ProductPage from './pages/productPage'

function App() {
  //useState
  const [ isLoggedIn, setIsLoggedIn] = useState(false);
  
  return (
  <>
    {isLoggedIn ? <ProductPage isLoggedIn={isLoggedIn}/>
    :<LoginPage setIsLoggedIn={setIsLoggedIn}/> }
  </>
  )
}

export default App
