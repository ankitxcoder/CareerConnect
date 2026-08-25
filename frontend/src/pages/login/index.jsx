import UserLayout from '@/layouts/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import styles from "./styles.module.css"
function LoginComponent() {
  

  const router = useRouter();
  const authState = useSelector((state)=>state.auth);

  const [isLogin, setIsLogin] =useState(false);


  useEffect(()=>{
    if(authState.loggedIn){
      router.push("/dashboard");
    }
  },[authState.loggedIn, router])



  return (
    <div>

      <UserLayout>
        <div className="flex min-h-[calc(100vh-66.4px)] justify-center bg-gray-100 px-6 py-6">

          <div className='flex w-full max-w-3xl flex-col md:flex-row overflow-hidden rounded-xl bg-black-50 shadow-2xl'>
                    <div className='w-full p-8 md:w-1/2 justify-items-center font-bold'>
                       <p>{isLogin ? "Sign In" : "Sign Up"}</p>
                    <div className='flex m-4 gap-2 mb-5 flex-col gap-5'>
                       <input className="border-2 rounded-xl px-4" type="text" placeholder="enter Name"></input>
                       <input className="border-2 rounded-xl px-4" type="text" placeholder="enter UserName"></input>
                      
                    </div>
                    <div className='flex flex-col max-w-2x1 gap-5'>
                      <input className="m-1 rounded-xl border-2 px-4" type="email" placeholder="email"/>
                      <input className="border-2 rounded-xl  m-1 px-4" type="password" placeholder="password"/>
                      <button className="BUTTO">Submit</button>

                    </div>
                    

       
                    </div>

                    <div className="w-full bg-gradient-to-br from-pink-500 to-blue-600 p-8 text-white md:w-1/2">

                    </div>

          </div>

        </div>
      </UserLayout>
        
    </div>
  )
}

export default LoginComponent
