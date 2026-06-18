 import React, { useEffect } from 'react'
 import {Routes ,Route, Navigate,  } from 'react-router-dom'
 import Home from './pages/Home'
 import Auth from './pages/Auth'
 import History from './pages/History'
import { getCurrentUser } from './sevices/api'
import { useDispatch, useSelector } from 'react-redux'
import Notes from './pages/Notes'
import Pricing from './pages/Pricing'
import Paymetnsuccess from './pages/Paymetnsuccess'
import PaymentFailed from './pages/PaymentFailed'

 export const serverUrl = "https://examnotesai-backend-aky7.onrender.com"
 
 const App = () => {

  const dispatch = useDispatch()

  useEffect(()=>{  
 getCurrentUser(dispatch)
  },[dispatch])

 const {userData} = useSelector(state=>state.user)
  

   return (

      <>
      <Routes>
        <Route path='/' element={ userData?<Home/>:<Navigate to="/auth" replace/>} />
       <Route path='/auth' element={userData ? <Navigate to="/" replace /> :<Auth/>} />
       <Route path='/history' element={ userData?<History/>:<Navigate to="/auth" replace/>} />
       <Route path='/notes' element={ userData?<Notes/>:<Navigate to="/auth" replace/>} />
      <Route path='/pricing' element={ userData?<Pricing/>:<Navigate to="/auth" replace/>} />

      <Route path='/payment-success'  element={<Paymetnsuccess/>}/>
       <Route path='/payment-failed'  element={<PaymentFailed/>}/>
      </Routes>
      </>
   )
 }
 
 export default App