import { getAboutUser } from "@/config/redux/action/authAction";
import { setTokenIsThere } from "@/config/redux/reducer/authReducer";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function DashBoardLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (localStorage.getItem("token") === null) {
      router.push("/login");
    } else {
      dispatch(setTokenIsThere());
      if (!authState.profileFetched) {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
      }
    }
  }, [router, authState.profileFetched, dispatch]);

  const navItems = [
    {
      name: "Feed",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      ),
    },
    {
      name: "Discover",
      path: "/discover",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      ),
    },
    {
      name: "Network",
      path: "/my_connections",
      icon: (
        <svg
          className="w-5 h-5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
          />
        </svg>
      ),
    },
  ];

  const currentUserAvatar =
    authState.user?.userId?.profilePicture &&
    authState.user.userId.profilePicture !== "undefined"
      ? authState.user.userId.profilePicture
      : DEFAULT_AVATAR;

  return (
    <div className="flex justify-center max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 gap-4 lg:gap-8 pt-4 md:pt-6 pb-24 md:pb-12">
      <aside className="shrink-0 md:w-16 lg:w-60">
        <div className="md:sticky md:top-24 flex flex-col gap-4">
          <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-zinc-200 dark:border-white/10 px-4 py-2.5 flex justify-around items-center md:static md:bg-transparent md:border-0 md:p-0 md:flex-col md:gap-2">
            {navItems.map((item) => {
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 w-full justify-center lg:justify-start ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {authState.user && (
            <div
              onClick={() => router.push("/profile")}
              className="hidden md:flex items-center gap-3 p-2.5 lg:p-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl cursor-pointer hover:border-indigo-500/40 transition-all duration-200 group shadow-sm justify-center lg:justify-start"
            >
              <img
                src={currentUserAvatar}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition-all shrink-0"
                alt="Profile"
              />
              <div className="hidden lg:block min-w-0 flex-1">
                <p className="font-bold text-xs text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {authState.user?.userId?.name || "Member"}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  @{authState.user?.userId?.userName || "account"}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 max-w-2xl min-w-0 w-full">{children}</main>

      <aside className="hidden xl:block w-72 shrink-0">
        <div className="sticky top-24 rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm tracking-tight">
              Top Professionals
            </h4>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800/40">
              Network
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {authState.all_profile_fetched &&
              authState.all_users?.slice(0, 5).map((profile) => {
                const userPic =
                  profile.userId?.profilePicture &&
                  profile.userId.profilePicture !== "undefined"
                    ? profile.userId.profilePicture
                    : DEFAULT_AVATAR;

                return (
                  <div
                    key={profile._id}
                    onClick={() => {
                      if (profile.userId?.userName) {
                        router.push(`/view_profile/${profile.userId.userName}`);
                      }
                    }}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-800/50 cursor-pointer transition-all group"
                  >
                    <img
                      src={userPic}
                      onError={(e) => {
                        e.currentTarget.src = DEFAULT_AVATAR;
                      }}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-zinc-700 shrink-0"
                      alt={profile.userId?.name || "User"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-zinc-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {profile.userId?.name || "Professional"}
                      </p>
                      <p className="text-[11px] text-zinc-400 truncate">
                        @{profile.userId?.userName || "user"}
                      </p>
                    </div>
                    <button className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                      View
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default DashBoardLayout;
