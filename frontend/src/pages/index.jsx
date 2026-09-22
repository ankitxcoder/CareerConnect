import { useRouter } from "next/router";
import UserLayout from "@/layouts/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className="relative w-full min-h-[calc(100vh-66.4px)] overflow-hidden flex items-center justify-center z-10 bg-black transform transition-all">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full mx-auto absolute top-0 left-0  object-cover -z-10 opacity-60"
        >
          <source src="/Networking_app_interface_animation_1080p_20260920143931_erasio (1).mp4" />
        </video>

        <div className="container mx-auto px-6">
          <div className="mainContainer flex flex-col md:flex-row min-h-[calc(100vh-66.4px)] ">
            <div className="mainContainer_left flex w-full flex-col justify-center md:w-1/2 text-[#FFFFFF]">
              <p className="font-mono text-5xl font-large m-10 ">
                Connect with Friends without Exaggeration
              </p>
              <p className="text-4xl m-10 text-[#0066FF]">
                A true Social media platform with stories and no blufs
              </p>
              <div
                onClick={() => {
                  router.push("/login");
                }}
                className=" animate-bounce w-36 mx-10 group rounded-md bg-gradient-to-r from-pink-400 to-blue-600 p-[2px]"
              >
                <span className="block text-lg text-center font-medium text-white rounded-md px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer">
                  Join
                </span>
              </div>
            </div>

            <div className="mainContainer_right relative flex w-full items-center justify-center md:w-1/2 ">
              <img
                src="/homeImage.svg"
                className="absolute w-full animate-pulse drop-shadow-xl"
              />
              <img
                src="/girlimagetwo.svg"
                className="absolute w-full drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
