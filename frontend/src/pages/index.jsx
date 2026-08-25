import { useRouter } from "next/router"
import UserLayout from "@/layouts/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
       <div className="container mx-auto px-6 ">
        <div className="mainContainer flex flex-col md:flex-row min-h-[calc(100vh-66.4px)] ">


          <div className="mainContainer_left flex w-full flex-col justify-center md:w-1/2 ">
          <p className="font-mono text-5xl font-medium m-10">Connect with Friends without Exaggeration</p>
          <p className="text-4xl m-10">A true Social media platform with stories and no blufs</p>
               <div
                     onClick={()=>{
                    router.push("/login")
                    }} className=" animate-bounce w-36 mx-10 group rounded-md bg-gradient-to-r from-pink-400 to-blue-600 p-[2px]">
  <span className="block text-lg text-center font-medium text-white rounded-md px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer">
    Join
  </span>
                </div>
          </div>
          
          <div className="mainContainer_right relative flex w-full items-center justify-center md:w-1/2 ">
            <img src="/homeImage.svg" className="absolute w-full animate-pulse drop-shadow-xl"/>
            <img src="/girlimagetwo.svg" className="absolute w-full drop-shadow-xl"/>
          </div>
        </div>
       </div>
    </UserLayout>
  )
}
