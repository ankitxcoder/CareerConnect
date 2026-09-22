import Navbar from '@/Components/Navbar'
import React,{useState,useEffect} from 'react'

function UserLayout({children}) {

  const [isDarkMode,setIsDarkMode] = useState(false);

useEffect(()=>{
  if(localStorage.getItem("theme")==="dark"){
    setIsDarkMode(true);
  }
},[])

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      </Navbar>
              <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
  
                   {children}
  
               </div>
    </div>
  )
}

export default UserLayout