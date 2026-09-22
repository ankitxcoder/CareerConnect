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
      <div className={styles.container}>
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

          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
            }}
            className="ml-auto mr-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:text-[#6f7576]"
          >
            {isDarkMode ? "Day" : "Night"}
          </button>

          {authState.profileFetched ? (
            <div
              onClick={() => router.push("/profile")}
              className="ml-auto w-35 text-[#d1dbdb] font-bold"
            >
              Profile({authState.user?.userId?.name})
            </div>
          ) : (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className="ml-auto w-35 mr-10 group rounded-md bg-gradient-to-r from-pink-400 to-blue-600 p-[2px]"
            >
              <span className="text-gray-600 block text-lg text-center font-medium group-hover:text-white rounded-md bg-white px-4 py-2.5 leading-5 transition-all duration-75 ease-in group-hover:bg-transparent cursor-pointer">
                be a part
              </span>
            </div>
          )}

          {authState.profileFetched ? (
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
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
