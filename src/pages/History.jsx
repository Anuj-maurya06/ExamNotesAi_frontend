 import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import FinalResult from "../components/FinalResult";

const History = () => {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  const credits = userData?.credits || 0;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topic, setTopic] = useState([]);
  const [selectNote, setSelectNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeNoteId, setActiveNotedId] = useState(null);
  const [deletingNoteId, setDeletingNoteId] = useState(null);

  useEffect(() => {
    const myNotes = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/notes/getnotes`,
          {
            withCredentials: true,
          }
        );

        console.log(res.data);

        setTopic(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.log(error);
      }
    };

    myNotes();
  }, []);


  const openNotes = async (noteId) => {
    setLoading(true);
    setActiveNotedId(noteId);
    try {
      const res = await axios.get(serverUrl + `/api/notes/${noteId}`, {
        withCredentials: true,
      });

      setSelectNote(res.data.content);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteNote = async (noteId) => {
    setDeletingNoteId(noteId);
    try {
      await axios.delete(serverUrl + `/api/notes/${noteId}`, {
        withCredentials: true,
      });

      setTopic((current) => current.filter((note) => note._id !== noteId));
      if (activeNoteId === noteId) {
        setSelectNote(null);
        setActiveNotedId(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingNoteId(null);
    }
  };

  useEffect(() =>{
    if (window.innerWidth >= 1022){
      setIsSidebarOpen(true)
    }
  },[])

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-100 px-6 py-8">
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          mb-10
          rounded-2xl
          bg-black/80
          backdrop-blur-xl
          border border-white/10
          px-8 py-6
          flex justify-between items-start md:items-center
          gap-4 flex-wrap
          shadow-[0_20px_45px_rgba(0,0,0,0.6)]
        "
      >
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer"
        >
          <h1 className="text-2xl font-bold bg-linear-to-br from-white via-gray-300 to-white bg-clip-text text-transparent">
            ExamNotes AI
          </h1>

          <p className="text-sm text-gray-300 mt-1">
            AI-powered exam-oriented notes & revision
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-white text-2xl"
          >
            <GiHamburgerMenu />
          </button>

          {/* Credits Button */}
          <button
            onClick={() => navigate("/pricing")}
            className="
              flex items-center gap-2
              px-4 py-2 rounded-full
              bg-white/10 border border-white/20
              text-white text-sm
              hover:bg-white/20
            "
          >
            <span className="text-xl">🔷</span>

            <span>{credits}</span>

            <motion.span
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.97 }}
              className="
                ml-2 h-5 w-5
                flex items-center justify-center
                rounded-full bg-white
                text-black text-xs font-bold
              "
            >
              ➕
            </motion.span>
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="
                fixed lg:static
                top-0 left-0
                z-50 lg:z-auto
                w-72 lg:w-auto
                h-full lg:h-[75vh]
                lg:rounded-3xl lg:col-span-1
                bg-black/90 lg:bg-black/80
                backdrop-blur-xl
                border border-white/10
                shadow-[0_20px_45px_rgba(0,0,0,0.6)]
                p-5
                overflow-y-auto
              "
            >
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white mb-4"
              >
                ⬅️ Back
              </button>
 
         <div  className="mb-4 space-y-1 ">
          <button onClick={()=>navigate("/notes")}
          className="w-full px-3 py-2 rounded-lg text-sm text-gray-200 bg-white/10 text-start hover:bg-white/20">
               ➕ New Notes
          </button>
        
         <hr  className="border-white/10 mb-4"/>

         <h2 className="mb-4 text-lg font-bold bg-linear-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
        📝 Your Notes
         </h2>

         {topic.length ===0 && (
          <p className="text-sm text-gray-400">No notes created yet</p>
         ) }

         <ul className="space-y-3">
          {topic.map((t, i) => (
            <li
              key={i}
              className={`rounded-xl p-3 border transition-all flex flex-col gap-3
                ${
                  activeNoteId == t._id
                    ? "bg-indigo-500/30 border-indigo-400 shadow-[0_0_0_1px_rgba(99,102,241,0.6)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => openNotes(t._id)}
                  className="cursor-pointer flex-1"
                >
                  <p className="text-sm font-semibold text-white">{t.topic}</p>

                  <div className="flex flex-wrap gap-2 mt-2 text-xs">
                    {t.classLevel && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        ClassLevel : {t.classLevel}
                      </span>
                    )}

                    {t.examType && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        {t.examType}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteNote(t._id)}
                  disabled={deletingNoteId === t._id}
                  className="shrink-0 rounded-full bg-red-400 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingNoteId === t._id ? "Deleting..." : "Delete"}
                </button>
              </div>

              <div className='flex gap-3 text-xs text-gray-300'>
                {t.revisionMode && <span>⚡ Revision</span>}
                {t.includeDiagram && <span>📊 Diagram</span>}
                {t.includeChart && <span>📈 Chart</span>}
              </div>
            </li>
          ))}
         </ul>
         </div>

            </motion.div>
          )}
        </AnimatePresence>


     <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
     className="lg:col-span-3 rounded-2xl
     bg-white shadow-[0_15px_40px_rgba(0,0,0,0.15)]
     p-6 min-h-[75vh]">

      {loading && <p className="text-center text-gray-500">Loading notes...</p>}
      {!loading && !selectNote && (
        <div className="h-full flex items-center justify-center text-gray-400">select a topic from the sidebar</div>
      )}

      {!loading && selectNote && <FinalResult result={selectNote}/>}
     </motion.div>

      </div>
    </div>
  );
};

export default History;