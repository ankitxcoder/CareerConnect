import { BASE_URL } from "@/config";
import {
  acceptConnection,
  getMyConnectionRequest,
  getUserConnections,
} from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function MyConnections() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("requests");

  const refreshData = () => {
    const token = localStorage.getItem("token");
    dispatch(getMyConnectionRequest({ token }));
    dispatch(getUserConnections({ token }));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const getProfileImage = (picture) => {
    if (!picture || picture === "undefined") return DEFAULT_AVATAR;
    if (picture.startsWith("http")) return picture;
    return `${BASE_URL}/${picture}`;
  };

  const pendingRequests = authState.connections || [];
  const networkFriends = authState.getUserConnections || [];

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className="flex flex-col gap-6 w-full pb-16">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                Network & Connections
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium mt-1">
                Manage your pending invitations and expand your professional
                circle.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-white/5 w-fit">
              <button
                onClick={() => setActiveTab("requests")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "requests"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span>Invitations</span>
                {pendingRequests.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-extrabold">
                    {pendingRequests.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("friends")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "friends"
                    ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span>My Network</span>
                <span className="px-1.5 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-300">
                  {networkFriends.length}
                </span>
              </button>
            </div>
          </div>

          {activeTab === "requests" && (
            <div className="flex flex-col gap-4">
              {pendingRequests.length === 0 ? (
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
                        strokeWidth={1.8}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-zinc-900 dark:text-white text-base">
                    No pending requests
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    You're all caught up! Explore Discover to connect with new
                    people.
                  </p>
                </div>
              ) : (
                pendingRequests.map((connection) => {
                  const avatar = getProfileImage(
                    connection.userId?.profilePicture,
                  );

                  return (
                    <div
                      key={connection._id}
                      className="rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div
                        onClick={() => {
                          if (connection.userId?.userName) {
                            router.push(
                              `/view_profile/${connection.userId.userName}`,
                            );
                          }
                        }}
                        className="flex items-center gap-4 cursor-pointer group flex-1 min-w-0"
                      >
                        <img
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 group-hover:ring-indigo-500/40 transition-all shadow-md shrink-0 bg-zinc-100 dark:bg-zinc-800"
                          src={avatar}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                          alt={connection.userId?.name || "User"}
                        />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {connection.userId?.name || "Member"}
                          </h3>
                          <p className="text-xs font-semibold text-zinc-400 truncate">
                            @{connection.userId?.userName || "anonymous"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                        <button
                          onClick={() => {
                            dispatch(
                              acceptConnection({
                                token: localStorage.getItem("token"),
                                requestId: connection._id,
                                action_type: "accept",
                              }),
                            )
                              .unwrap()
                              .then(() => refreshData());
                          }}
                          className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => {
                            dispatch(
                              acceptConnection({
                                token: localStorage.getItem("token"),
                                requestId: connection._id,
                                action_type: "reject",
                              }),
                            )
                              .unwrap()
                              .then(() => refreshData());
                          }}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-600 dark:text-zinc-400 hover:text-rose-600 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "friends" && (
            <div className="flex flex-col gap-4">
              {networkFriends.length === 0 ? (
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
                        strokeWidth={1.8}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="font-bold text-zinc-900 dark:text-white text-base">
                    No connections yet
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">
                    Start connecting with other engineers from the Discover
                    section.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {networkFriends.map((oneConnection) => {
                    const friend =
                      authState.user?.userId?._id === oneConnection.userId?._id
                        ? oneConnection.connectionId
                        : oneConnection.userId;

                    const avatar = getProfileImage(friend?.profilePicture);

                    return (
                      <div
                        key={oneConnection._id}
                        onClick={() => {
                          if (friend?.userName) {
                            router.push(`/view_profile/${friend.userName}`);
                          }
                        }}
                        className="group rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4"
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 group-hover:ring-indigo-500/40 transition-all shadow-md shrink-0 bg-zinc-100 dark:bg-zinc-800"
                            src={avatar}
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_AVATAR;
                            }}
                            alt={friend?.name || "Friend"}
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-zinc-900 dark:text-white text-[15px] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {friend?.name || "Professional"}
                            </h3>
                            <p className="text-xs font-semibold text-zinc-400 truncate">
                              @{friend?.userName || "anonymous"}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          <span>Connected</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default MyConnections;
