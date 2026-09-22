import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


function DashBoardLayout({children}) {

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);

   useEffect(()=>{
      if(localStorage.getItem("token")=== null){
        router.push("/login")
      } else {
        dispatch(setTokenIsThere());
      }
    }, [router]);


  return (
      <div className="container flex justify-center max-w-7xl mx-auto w-full min-h-screen pt-4">

        <div className="homeContainer flex w-1/4">


                 
                   <div className="homeContainer_leftBar    hidden md:flex flex-col w-full  gap-4  border-r border-gray-200">
                          <div className="flex flex-row items-center  gap-3 font-medium text-gray-700 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-500"
                                onClick={()=>{
                                  router.push("/dashboard")
                                }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                            <p className='max-h-[20em]'>Scroll</p>
                          </div>

                          <div className="flex flex-row items-center gap-3 font-medium text-gray-700 dark:text-white dark:hover:text-blue-600 hover:text-blue-600 cursor-pointer"
                             onClick={()=>{
                              router.push("/discover");
                             }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                            <p className='max-h-[20em]'>Discover</p>
                          </div>

                          <div className="flex flex-row items-center gap-3 font-medium text-gray-700 dark:text-white hover:text-blue-500 dark:hover:text-blue-500  cursor-pointer"
                             onClick={()=>{
                              router.push("/my_connections");
                             }}>
                              
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                             </svg>
                            <p className='max-h-[20em]'>My Connections</p>
                          </div>
                   </div>
                 

              
        </div>


        <div className="homeContainer_feedContainer flex-1">
            {children}
               
        </div>
  
        <div className="homeContainer_extraContainer w-1/4 border-l border-gray-200">
        <div  className="flex flex-row justify-end font-medium ">Top Profile</div>
        {authState.all_profile_fetched && authState.all_users.map((profile)=>{
          return (
            <div key={profile._id} className='items-center text-center '>
              <p>{profile.userId?.name}</p>
              <p>{profile.userId?.email}</p>
            </div>
          )
        })}
        </div>

      </div>
  )
}

export default DashBoardLayout;