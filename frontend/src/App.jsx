import React from "react"
import {BrowserRouter, Navigate,Routes,Route} from 'react-router-dom'
import LoginPage from "./pages/Login/LoginPage.jsx"
import UploadPYQ from "./pages/Home/UploadPYQ.jsx"
import RegisterPage from "./pages/Register/RegisterPage.jsx"
import PageNotFound from "./pages/PageNotFound/PageNotFound.jsx"

function App() {
  return (
    <>
    <div className="App">
      <BrowserRouter>
    <Routes>
      {/* <Route path='/' element={<Navigate to="/login"/>}/> */}
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/' element={<UploadPYQ/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
    </BrowserRouter>
    </div>

    </>
  )
}

export default App
