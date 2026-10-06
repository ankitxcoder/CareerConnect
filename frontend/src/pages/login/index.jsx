import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(false);

  // form input value ko local store krna
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });

  // this run when ever user type any thing in form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handeling submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser(formData));
    } else {
      dispatch(registerUser(formData));
    }
  };

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    dispatch(reset());
    setFormData({
      name: "",
      userName: "",
      email: "",
      password: "",
    });
  }, [isLogin, dispatch, setFormData]);

  return (
    <div>
      <UserLayout>
        <div className="flex min-h-[calc(100vh-62.4px)] justify-center bg-gradient-to-t from-[#a2a3a4] to-[#131d36] dark:from-[#0A0A0A] to-[#0F172B] px-6 py-6 ">
          <div className="flex w-full max-w-3xl flex-col md:flex-row overflow-hidden  rounded-2xl shadow-2xl ">
            <div className="w-full p-8 pb-25  md:w-1/2 justify-items-center font-bold bg-gradient-to-b from-[#e5e7e5] to-[#b5b6b7] ">
              <p className=" dark:text-gray-700">
                {isLogin ? "Sign In" : "Sign Up"}
              </p>
              {authState.message?.message}
              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="flex gap-2 mb-5 flex-col gap-5">
                    <input
                      className="m-2 border-2 rounded-xl px-4 dark:bg-gray-700 dark:border-gray-600 drak:text-white dark:placeholder-gray-400"
                      type="text"
                      placeholder="enter Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    ></input>
                    <input
                      className="m-2 border-2 rounded-xl px-4 dark:bg-gray-700 dark:border-gray-600 drak:text-white dark:placeholder-gray-400"
                      type="text"
                      placeholder="enter UserName"
                      name="userName"
                      value={formData.userName}
                      onChange={handleChange}
                    ></input>
                  </div>
                )}

                <div className="flex flex-col max-w-2x1 gap-5">
                  <input
                    className="m-2 rounded-xl border-2 px-4 dark:bg-gray-700 dark:border-gray-600 drak:text-white dark:placeholder-gray-400"
                    type="email"
                    placeholder="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <input
                    className="border-2 rounded-xl  m-2 px-4 dark:bg-gray-700 dark:border-gray-600 drak:text-white dark:placeholder-gray-400"
                    type="password"
                    placeholder="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    className="w-full bg-[#00D492] cursor-pointer hover:bg-sky-700 transition ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-[1.02] active:scale-95"
                    type="submit"
                  >
                    {" "}
                    Submit
                  </button>
                </div>
              </form>
            </div>

            <div className=" w-full max-w-3xl overflow-hidden pt-10 pb-16 rounded-b-2xl shadow-2xl  text-white md:w-1/2 md:ml-[1px] md:bg-gradient-to-b from-[#e8eae8] to-[#10192e] bg-gradient-to-t from-[#29b54f] to-[#10192e] ">
              <p className=" text-center font-bold mt-10  transition-all duration-300 -translate-0.5 text-gray-700">
                {isLogin ? "don't have an account" : "Alreday have an account?"}
              </p>
              <p
                className="cursor-pointer text-center font-bold mt-10 hover:underline transition-all duration-300 hover-text hover:text-blue-800 "
                onClick={() => setIsLogin(!isLogin)
                  
                }
              >
                {isLogin ? "Sign Up" : "Sign In"}

              </p>
            </div>
          </div>
        </div>
      </UserLayout>
    </div>
  );
}

export default LoginComponent;
