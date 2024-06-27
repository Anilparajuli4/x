import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"


function App() {
  return (
    <div className='flex max-w-6xl mx-auto'>
    <Routes>
      <Route path='/'  element={<Home/>}/>
      <Route path='/login'  element={<Login/>}/>
      <Route path='/signup'  element={<SignUp/>}/>
    </Routes>
    </div>
  )
}

export default App