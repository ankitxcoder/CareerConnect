import UserLayout from '@/layouts/UserLayout'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./styles.module.css"
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { reset } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);

  const [isLogin, setIsLogin] =useState(false);


  // form input value ko local store krna
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  // this run when ever user type any thing in form 
  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handeling submit 
  const handleSubmit = (e)=>{
    e.preventDefault();
   if (isLogin){
    dispatch(loginUser(formData));
  } else{
    dispatch(registerUser(formData));
  }};


  useEffect(()=>{
    if(authState.loggedIn){
      router.push("/dashboard");
    }
  },[authState.loggedIn, router])

  useEffect(()=>{
    dispatch(reset());
    setFormData({
      name: "",
      userName: "",
      email: "",
      password: "",
    });
  },[isLogin,dispatch,setFormData]);

  return (
    <div>

      <UserLayout>
        <div className="flex min-h-[calc(100vh-66.4px)] justify-center bg-gray-50 px-6 py-6 border border-pink-300">

          <div className='flex w-full max-w-3xl flex-col md:flex-row overflow-hidden rounded-xl bg-black-50 shadow-2xl'>
                   
                  
                    
                    <div className='w-full p-8 md:w-1/2 justify-items-center font-bold'>
                       <p>{isLogin ? "Sign In" : "Sign Up"}</p>
                       {authState.message?.message}

                <form onSubmit={handleSubmit}>
                   
                    { !isLogin && (
                   <div className='flex gap-2 mb-5 flex-col gap-5'>
                       <input className="m-2 border-2 rounded-xl px-4" type="text" placeholder="enter Name" name="name" value={formData.name} onChange={handleChange}></input>
                       <input className="m-2 border-2 rounded-xl px-4" type="text" placeholder="enter UserName" name="userName" value={formData.userName} onChange={handleChange}></input>
                      
                    </div>
                           )}


                    <div className='flex flex-col max-w-2x1 gap-5'>
                      <input className="m-2 rounded-xl border-2 px-4" type="email" placeholder="email" name="email" value={formData.email} onChange={handleChange}/>
                      <input className="border-2 rounded-xl  m-2 px-4" type="password" placeholder="password" name="password" value={formData.password} onChange={handleChange}/>
                      <button className="w-full bg-cyan-300 cursor-pointer hover:bg-sky-700 transition delay-150 duration-300 ease-in-out" type='submit'> Submit</button>

                    </div>

                   
                             </form>
                    


                    </div>
        
                    <div className="w-full bg-gradient-to-br from-pink-500 to-blue-600 p-8 text-white md:w-1/2">
                                
                                <p className='cursor-pointer' onClick={()=>setIsLogin(!isLogin)}>{isLogin ? "Sign Up" : "sign In"}</p>
                    </div>

          </div>

        </div>
      </UserLayout>
        
    </div>
  )
}

export default LoginComponent
