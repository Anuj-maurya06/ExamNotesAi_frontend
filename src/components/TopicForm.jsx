import React, { useState } from 'react'
import {motion} from 'motion/react'
import { generateNotes } from '../sevices/api.js'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateCredits } from '../redux/userSlice.js';

const TopicForm = ({setResult, setLoading, loading, setError}) => {
  const [topic, setTopic] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [examType, setExamType] = useState("");
  const [revisionMode, setRivisionMode] = useState(false);
  const [includeDiagram, setIncludeDiagram] = useState(false);
  const [includeChart, setIncludeChart] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressTest, setProgressTest] = useState("");
  const dispatch = useDispatch()

const handlesubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter the topic")
      return
    }

    setError("")
    setLoading(true)
    setResult(null)

    try {
      const result = await generateNotes({
        topic,
        classLevel,
        examType,
        revisionMode,
        includeDiagram,
        includeChart,
      })

      setResult(result.data)
      setLoading(false)
      setClassLevel("")
      setTopic("")
      setExamType("")
      setIncludeChart(false)
      setRivisionMode(false)
      setIncludeDiagram(false)

      if(typeof result.creditsLeft == "number"){
      dispatch(updateCredits(result.creditsLeft))
      }

    } catch (error) {
      console.error(error.response?.data || error.message || error)
      setError("Failed to fetch notes from server")
    } finally {
      setLoading(false)
    }
}

  useEffect(()=>{
  if(!loading){
    setProgress(0);
    setProgressTest("")
    return;
  }
  let value = 0;

const interval = setInterval(()=>{
 value += Math.random() * 8 
 if (value >= 95){
  value = 95;
  setProgressTest("Almost done...");
  clearInterval(interval);
 }else if (value > 70 ){
  setProgressTest("Finalizing notes...");
 }else if (value > 40){
  setProgressTest("Proccessing content...");
 }else {
  setProgressTest("Generating notes");
 }
 setProgress(Math.floor(value))
},700)

 return ()=> clearInterval(interval); 

  },[loading])
  

  return (
    <motion.div 
      initial={{opacity: 0, y:20}}
      animate={{opacity: 1, y: 0}}
      className='rounded-2xl bg-linear-to-br from-black/90 via-black/80 to-black/90
  backdrop-blur-2xl border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.6)]
  flex flex-col p-8 gap-6 text-white'>

       <input type="text" className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/30' placeholder="enter topic (e.g Web development)"
       onChange={(e)=>(setTopic(e.target.value))}
       value={topic}
       />
       <input type="text" className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/30' placeholder="Class / Level (e.g. class 10)"
       onChange={(e)=>(setClassLevel(e.target.value))}
       value={classLevel}
       />
       <input type="text" className='w-full p-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-white/30' placeholder="EXam Type (e.g. CBSE, JEE, NEET)"
       onChange={(e)=>(setExamType(e.target.value))}
       value={examType}
       />

         <div className='flex flex-col md:flex-row gap-6'> 
         <Toggle label="Exam Revision Mode" checked={revisionMode} onChange={()=>setRivisionMode(!revisionMode)}
          />
         <Toggle label="Include Diagram" checked={includeDiagram} onChange={()=>setIncludeDiagram(!includeDiagram)}
              />
         <Toggle label="Include Charts" checked={includeChart} onChange={()=>setIncludeChart(!includeChart)}
                  />
          </div>

         <motion.button
         type="button"
         onClick={handlesubmit}
         whileHover={!loading ? {scale: 1.02, y:-2} : {}}
         whileTap={!loading ? {scale: 0.95} : {}}
         disabled={loading}
         className={`
          w-full mt-4 bg-white rounded-2xl
          py-3  font-semibold
          flex items-center justify-center gap-3 
          transition
          ${
          loading
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "bg-linear-to-br from-white-200 text-black shadow-[0_15px_35px_rgba(0,0,0,0.4)"
          }`}>
           {loading ? "Generating Notes..." : "Generate Notes"}

         </motion.button>

        {loading && 
        <div className='mt-4 space-y-2'>

          <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>
          <motion.div 
          initial={{width:0}}
          animate={{width: `${progress}%`}}
          transition={{ease: "easeOut" , duratin:0.6}}
          className='h-full bg-linear-to-br from-green-400 via-emera1d-400 to-green-500'>

          </motion.div>
          </div>
             
             <div className='flex justify-between text-xs text-gray-300'>
             <span>{progressTest}</span>
             <span>{progress}%</span>
             </div>
  
            <p className='text-xs text-gray-400 text-center'>
              This my take up to 2-5 minutes. Please don't close or refresh the page.
            </p>

          </div>}          

    </motion.div>
  )
}  
  function Toggle({ label, checked, onChange }) {
  return (
    <div
      className="flex items-center gap-4 cursor-pointer select-none"
      onClick={onChange}
    >
      <motion.div
        className="relative w-12 h-6 rounded-full"
        animate={{
          backgroundColor: checked
            ? "rgba(34,197,94,0.35)"
            : "rgba(255,255,255,0.15)",
        }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_5px_15px_rgba(0,0,0,0.5)]"
          style={{
            left: checked ? "1.6rem" : "0.25rem",
          }}
        />
      </motion.div>

      <span
        className={`text-sm transition-colors ${
          checked ? "text-green-300" : "text-gray-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
   
   


 
export default TopicForm