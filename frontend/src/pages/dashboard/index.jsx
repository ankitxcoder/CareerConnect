import { getAboutUser } from '@/config/redux/action/authAction';
import { getAllPosts } from '@/config/redux/action/postAction';
import UserLayout from '@/layouts/UserLayout';
import { useRouter } from 'next/router';
import React from 'react'
import { useEffect , useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';

function Dashboard() {


  const router = useRouter();
//talk to action to call getAllPosts
  const dispatch = useDispatch();
//binoculars like pointing to store to get posts slice
  const postState = useSelector((state)=>(state.posts));
  const authState = useSelector((state)=>(state.auth));


  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(()=>{
    if(localStorage.getItem("token")=== null){
      router.push("/login")
    } else {
      setIsTokenThere(true);
    }
  }, [router]);

  useEffect(()=>{
    if (isTokenThere){
      dispatch(getAllPosts());
      dispatch(getAboutUser({token:localStorage.getItem("token")}))
    }
  },[isTokenThere,dispatch]);

  return (
    <UserLayout>
      {authState.profileFetched && (<div>Welcome {authState.user?.userId?.name}.</div>)}
      <h1 className='font-bold mb-5'>Your Dashboard</h1>

    </UserLayout>
  
  )
}

export default Dashboard;