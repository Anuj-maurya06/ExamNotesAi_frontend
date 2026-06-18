 

 import React, { useEffect } from 'react'
 import { motion } from 'framer-motion'
import { FiClock } from "react-icons/fi";
import { getCurrentUser } from '../sevices/api';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
 
 const PaymetFailed = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
     
    getCurrentUser(dispatch)

    const t = setTimeout(()=>{
    
  navigate("/")

    },4000);

    return ()=>clearTimeout(t)

  },[])
   return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-4 p-4'>
  <motion.div
  initial={{ scale: 0, rotation: -100}}
  animate={{ scale: 1, rotate: 360}}
  transition={{
    duration: 0.8,
    ease: "easeOut"
  }}
  className='text-red-500 text-500 text-6xl'>
   <FiClock/>

  </motion.div>

  <motion.h1
  initial={{ opacity: 0, y:20}}
  animate={{ opacity: 1 , y:0}}
  transition={{delay: 0.3}}
  className='text-2xl font-bold text-red-600'>
  Payment Failed 

  </motion.h1>

  <motion.p
  initial={{ opacity: 0}}
  animate={{ opacity: 1}}
  transition={{ delay: 0.6}}
  className='text-gray-500 text-sm'>

    Redirecting to home...
  </motion.p>

    </div>
   )
 }
 
 export default PaymetFailed
 