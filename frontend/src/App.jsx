import { useState } from 'react'
import{ Routes, Route } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify'
import EmailVerify from './pages/EmailVerify'
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <ToastContainer />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify/>} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      
      </Routes>
    </div>
  )
}

export default App
