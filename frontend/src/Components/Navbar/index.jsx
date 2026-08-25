import React from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'

function Navbar() {

  const router = useRouter();
  return (
    <div>
      {/* using Pure Css To Hndle same class css Conflict concept using below rule */}
        <div className={styles.container}>
           <div className={styles.navbar}>
             <h1 style={{cursor:"pointer"}} onClick={()=>{router.push("/")}}>Pro Connect</h1>

             <div onClick={()=>{ router.push("/login")}} className="ml-auto w-35 mr-10 group rounded-md bg-gradient-to-r from-pink-400 to-blue-600 p-[2px]">
                          <span className="text-gray-600 block text-lg text-center font-medium group-hover:text-white rounded-md bg-white px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer">
                               be a part
                          </span>
             </div>
         </div>


        </div>

    </div>
  )
}

export default Navbar
