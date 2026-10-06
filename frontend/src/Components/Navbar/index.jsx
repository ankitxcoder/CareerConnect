import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from "@/config/redux/reducer/authReducer";

function Navbar({ isDarkMode, setIsDarkMode }) {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  return (
    <div>
      {/* using Pure Css To Hndle same class css Conflict concept using below rule */}
      <div
        className={styles.container}
        style={{
          backgroundColor: router.pathname === "/login" ? "#091121" : undefined,
        }}
      >
        <div className={styles.navbar}>
          <h1
            className="text-[#00F0FF] hover:text-[#1ee7f6]"
            style={{ cursor: "pointer" }}
            onClick={() => {
              router.push("/");
            }}
          >
            Pro Connect
          </h1>

          <div className=" ml-auto flex flex-row items-center gap-6">
            {router.pathname === "/login" && (
              <span className="text-white">{isDarkMode ? "Dark /" : "light /"}</span>
            )}
            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
              }}
              className="p-2 rounded-full bg-gray-200 drak:bg-gray-800 text-gray-800 drak:text--gray-200 hover:scale-110 transition-all cursor-pointer"
            >
              {isDarkMode ? (
                "Dark mode on" && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                )
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            {authState.profileFetched ? (
              <div
                onClick={() => router.push("/profile")}
                className="ml-auto w-35 text-[#d1dbdb] font-bold cursor-pointer"
              >
                Profile({authState.user?.userId?.name})
              </div>
            ) : router.pathname !== "/login" ? (
              <div
                onClick={() => {
                  router.push("/login");
                }}
                className="ml-auto w-35 mr-10 group rounded-full bg-[#33F0D3] p-[2px]"
              >
                <span className="text-gray-600 block text-lg text-center font-medium group-hover:text-[#020605] rounded-md text-gray-700 hover:translate-0.5 px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer ">
                  be a part
                </span>
              </div>
            ) : null}

            {authState.profileFetched && (
              <p
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                  dispatch(reset());
                }}
                className="cursor-pointer text-[#d1d4d4] hover:text-[#b9bfbf]"
              >
                LogOut
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
