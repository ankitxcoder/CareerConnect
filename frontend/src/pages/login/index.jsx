import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./styles.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { reset } from "@/config/redux/reducer/authReducer";

const TypeWriter = () => {
  const [text, setText] = useState("");

  const fullText = "Elevate your \n professional \n network";

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setText(fullText.slice(0, i));
      if (i === fullText.length) clearInterval(timer);
    }, 70);

    return () => clearInterval(timer); //to prevent memory leaks
  }, []);

  return (
    <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight min-h-[140px] md:min-h-[160px]">
      {text.split("\n").map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index !== text.split("\n").length - 1 && <br />}
        </React.Fragment>
      ))}
      <span className="animate-pulse border-r-4 border-indigo-500 ml-1 pr-1"></span>
    </h1>
  );
};

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

  if (authState.isLoading) {
    return (
      <UserLayout>
        <div className="flex flex-col items-center justify-center min-h-[65vh] p-6 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 animate-spin"></div>
            </div>
          </div>
          <h3 className="font-extrabold text-xl text-zinc-900 dark:text-white tracking-tight mb-2">
            Waking Up Cloud Server...
          </h3>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-4">
            Our cloud backend auto-sleeps after 15 minutes of inactivity to save
            resources. Spin-up takes about 10–15 seconds. Thank you for your
            patience!
          </p>
          <div className="w-56 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-1/2 animate-[pulse_1.5s_infinite]"></div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex flex-1 w-full  py-10 px-4 sm:p-8 justify-center items-center bg-zinc-50 dark:bg-[#09090b] transition-colors duration-500">
        <div className="flex w-full max-w-[64rem] flex-col md:flex-row overflow-hidden rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl relative">
          <div className="w-full md:w-1/2 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">
              {isLogin
                ? "Enter your details to securely access your workspace."
                : "Join the exclusive professional network today."}
            </p>

            {authState.message?.message && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm font-semibold text-center">
                  {authState.message.message}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 w-full"
            >
              {!isLogin && (
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 text-zinc-900 dark:text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/10"
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 text-zinc-900 dark:text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/10"
                    type="text"
                    placeholder="Username"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                  />
                </div>
              )}

              <input
                className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 text-zinc-900 dark:text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/10"
                type="email"
                placeholder="Email address"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

              <input
                className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 text-zinc-900 dark:text-white rounded-2xl px-5 py-4 outline-none transition-all placeholder:text-zinc-400 shadow-sm focus:shadow-md focus:shadow-indigo-500/10"
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg rounded-2xl px-5 py-4 mt-4 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                type="submit"
              >
                {isLogin ? "Sign In to Workspace" : "Create Free Account"}
              </button>
            </form>

            <p className="text-center font-medium mt-8 text-zinc-500 dark:text-zinc-400">
              {isLogin ? "Don't have an account?" : "Already a member?"}
              <span
                className="ml-2 text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline transition-all"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up now" : "Sign in here"}
              </span>
            </p>
          </div>

          <div className="hidden md:flex w-1/2 p-12 relative flex-col justify-between overflow-hidden bg-[#0A0A0A]">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/40 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-20%] w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 mt-10">
              <TypeWriter />
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
              <p className="text-indigo-50 font-medium leading-relaxed italic text-sm">
                "CareerConnect has fundamentally changed how I network. The
                seamless interface and exclusive community access are unmatched
                in the industry."
              </p>
              <div className="mt-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                  AX
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Ankit X</p>
                  <p className="text-indigo-200 text-xs font-semibold tracking-wide">
                    Software Engineering
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
