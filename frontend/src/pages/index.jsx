import { useRouter } from "next/router";
import UserLayout from "@/layouts/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className="relative w-full min-h-[calc(100vh-66.4px)] max-w-[100vw] overflow-hidden flex items-center justify-center z-10 bg-black transform transition-all">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full mx-auto absolute top-0 left-0  object-cover -z-10 opacity-50"
        >
          <source src="/video/Networking_app_interface_animation_1080p_20260920143931_erasio (1).mp4" />
        </video>

        <div
          className="blue-box bg-transparent  relative rounded-3xl mr-0.5"
          style={{
            boxShadow:
              "0 0 40px 2px rgba(99, 102, 241, 0.25), 0 0 0 9999px rgba(0, 0, 0, 0.90)",
          }}
        >
          <div className="mainContainer flex flex-col md:flex-row w-full h-full md:py-40 ">
            <div className="mainContainer_left flex w-full flex-col justify-center md:w-1/2 text-[#FFFFFF]">
              <p className="font-semibold leading-[1.28] text-white text-3xl lg:text-[3.2rem] m-10 dark:text-[#C0C0C0]">
                Connect with Friends without Exaggeration
              </p>
              <p className="max-w-xl mx-10 text-base leading-relaxed text-slate-200 sm:text-lg">
                A true Social media platform with stories and no blufs
              </p>
              <div
                onClick={() => {
                  router.push("/login");
                }}
                className=" animate-bounce w-36 mx-25 mt-15 group rounded-full bg-[#18dcbf] p-[2px] hover:bg-[#2eedd1]"
              >
                <span className="block text-lg text-center font-medium text-gray-900 rounded-full px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer hover:scale-110">
                  Join
                </span>
              </div>
            </div>
            <div className="mainContainer_right relative flex w-full items-center justify-center  md:w-1/2 mt-12 md:mt-0 pb-16 md:pb-0">
              <div className="relative w-4/5 sm:w-2/3 md:w-full max-w-3xl mx-auto flex items-center justify-center ml-0">
                <img
                  src="/homeImage.svg"
                  className="absolute w-full animate-pulse drop-shadow-xl opacity-80"
                />
                <img
                  src="/girlimagetwo.svg"
                  className="relative w-full drop-shadow-2xl z-10 opacity-85"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
