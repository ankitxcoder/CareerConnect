import { BASE_URL } from "@/config";
import { getAllUser } from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Discover() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authState.all_profile_fetched) {
      dispatch(getAllUser());
    }
  }, [authState.all_profile_fetched, dispatch]);

  const filteredUsers = useMemo(() => {
    if (!authState.all_users) return [];
    if (!searchQuery.trim()) return authState.all_users;

    const query = searchQuery.toLowerCase();
    return authState.all_users.filter((user) => {
      const name = user.userId?.name?.toLowerCase() || "";
      const userName = user.userId?.userName?.toLowerCase() || "";
      const position = user.position?.toLowerCase() || "";
      return (
        name.includes(query) ||
        userName.includes(query) ||
        position.includes(query)
      );
    });
  }, [authState.all_users, searchQuery]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className="flex flex-col gap-6 w-full pb-16">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Discover Professionals
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                Explore, connect, and collaborate with creators and leaders.
              </p>
            </div>

            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
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
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, username, or role..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-white placeholder:text-zinc-400 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {!authState.all_profile_fetched ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-zinc-900/60 p-5 flex flex-col gap-4 animate-pulse"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="flex flex-col gap-2 flex-1">
                      <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                    </div>
                  </div>
                  <div className="h-9 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="font-bold text-zinc-900 dark:text-white text-base">
                No professionals found
              </p>
              <p className="text-zinc-500 text-xs mt-1">
                Try searching with a different name or keyword.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredUsers.map((user) => {
                const userAvatar =
                  user.userId?.profilePicture &&
                  user.userId.profilePicture !== "undefined"
                    ? user.userId.profilePicture
                    : DEFAULT_AVATAR;

                return (
                  <div
                    key={user._id}
                    onClick={() => {
                      if (user.userId?.userName) {
                        router.push(`/view_profile/${user.userId.userName}`);
                      }
                    }}
                    className="group relative overflow-hidden rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        <img
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 group-hover:ring-indigo-500/40 transition-all shadow-md bg-zinc-100 dark:bg-zinc-800"
                          src={userAvatar}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                          alt={user.userId?.name || "Professional"}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.userId?.name || "Member"}
                        </h3>
                        <p className="text-xs font-semibold text-zinc-400 truncate">
                          @{user.userId?.userName || "anonymous"}
                        </p>
                        {user.position && (
                          <span className="inline-block text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md mt-1 truncate max-w-full">
                            {user.position}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      <span>View Profile</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default Discover;
