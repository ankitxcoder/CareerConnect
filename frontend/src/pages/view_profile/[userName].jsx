import { api, BASE_URL } from "@/config";
import {
  getAboutUser,
  getMyConnectionRequest,
  getUserConnections,
  getWhatAreMyConnectionRequest,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { getAllPosts } from "@/config/redux/action/postAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ViewProfilePage({ userProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [userPosts, setUserPosts] = useState([]);

  const [connectionStatus, setConnectionStatus] = useState("Not_Connected");

  const toKnowuserForConnection =
    authState.user?.userId?._id === userProfile?.userId?._id;

  const getUsersPost = async () => {
    await dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    await dispatch(getAllPosts());
    await dispatch(
      getMyConnectionRequest({ token: localStorage.getItem("token") }),
    );
    await dispatch(
      getWhatAreMyConnectionRequest({ token: localStorage.getItem("token") }),
    );

    await dispatch(
      getUserConnections({ token: localStorage.getItem("token") }),
    );
  };

  useEffect(() => {
    getUsersPost();
  }, []);

  useEffect(() => {
    let filteredPosts = postState.posts.filter((post) => {
      return post.userId?.userName === router.query.userName;
    });
    setUserPosts(filteredPosts);
  }, [postState.posts, userProfile]);

  useEffect(() => {
    const dostBnChukeHaiYaRequestAyiHai = authState.getUserConnections?.some(
      (req) =>
        (req.userId?._id === userProfile.userId._id ||
          req.connectionId._id === userProfile.userId?._id) &&
        req.statusAccepted === true,
    );

    const kyaMaineRequestBejiHai = authState.connectionRequest?.some(
      (req) =>
        req.connectionId === userProfile.userId._id &&
        req.statusAccepted === null,
    );

    if (dostBnChukeHaiYaRequestAyiHai) {
      setConnectionStatus("Connected");
    } else if (kyaMaineRequestBejiHai) {
      setConnectionStatus("Pending");
    } else {
      setConnectionStatus("Not_connected");
    }
  }, [authState.getUserConnections, authState.connectionRequest, userProfile]);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className="container">
          <div className="relative h-48 w-full bg-cover bg-center rounded-2xl bg-[url('https://cdn.pixabay.com/photo/2022/04/15/07/58/sunset-7133867_1280.jpg')]">
            <img
              className="absolute -bottom-12 left-10 w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl object-cover bg-white z-10"
              src={
                userProfile?.userId?.profilePicture &&
                userProfile.userId.profilePicture !== "undefined"
                  ? userProfile.userId.profilePicture
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              onError={(e) => {
                e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
              alt="User Profile"
            />
          </div>

          <div>
            <div className="flex flex-col  mt-10 ml-10">
              <h1 className="">{userProfile?.userId?.name}</h1>
              <p>@{userProfile?.userId?.userName}</p>
            </div>

            <div className="flex flex-row">
              <div className="flex flex-col gap-4 mt-4 w-fit">
                <div className="flex flex-row gap-10 items-center">
                  {!toKnowuserForConnection ? (
                    connectionStatus === "Connected" ? (
                      <button className="border-2 p-2 px-4 rounded-md bg-green-500 text-white">
                        Connected
                      </button>
                    ) : connectionStatus === "Pending" ? (
                      <button className="border-2 p-2 px-4 rounded-md bg-green-500 text-white">
                        Pending
                      </button>
                    ) : (
                      <button
                        className="border-2 p-2 px-4 rounded-md bg-blue-500 text-white"
                        onClick={async () => {
                          setConnectionStatus("Pending");
                          await dispatch(
                            sendConnectionRequest({
                              token: localStorage.getItem("token"),
                              connectionId: userProfile.userId._id,
                            }),
                          );
                        }}
                      >
                        Connect
                      </button>
                    )
                  ) : null}

                  <div
                    className="cursor-pointer hover:opacity-80 transition"
                    onClick={async () => {
                      try {
                        if (!userProfile?.userId?._id) return;
                        const response = await api.get(
                          `/user/download_resume?id=${userProfile.userId._id}`,
                        );
                        if (response.data?.message) {
                          window.open(
                            `${BASE_URL}/${response.data.message}`,
                            "_blank",
                          );
                        }
                      } catch (err) {
                        alert(
                          "Failed to generate resume PDF. Please check server.",
                        );
                      }
                    }}
                  >
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
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <p>{userProfile.bio}</p>
              </div>
              <div className="mt-4 ml-auto mr-2">
                <h1 className="font-bold">Recent Activity</h1>
                {userPosts.map((onePost) => {
                  return (
                    <div key={onePost._id} className="mt-4 border-b-2 pb-4">
                      <p>{onePost.body}</p>
                      {onePost.media && (
                        <img
                          className="h-[10vh] mt-2 rounded"
                          src={`${onePost.media}`}
                          alt="Post Media"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 ml-10 mr-10 mb-10">
            <h4 className="text-xl font-bold text-gray-800 mb-6 border-b-2 inline-block ">
              Work History
            </h4>
            {userProfile.pastWork?.map((work, index) => {
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-300 border border-gray-100 p-6 flex flex-col relative overflow-hidden"
                >
                  <p className="">{work.company}</p>
                  <p>{work.position}</p>
                  <p>{work.year}</p>
                </div>
              );
            })}
          </div>
          <div></div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  console.log(context.query.userName);

  const request = await api.get("/user/get_profile_based_on_userName", {
    params: {
      userName: context.query.userName,
    },
  });

  const response = await request.data;
  console.log(response);
  return {
    props: {
      userProfile: request.data.profile,
    },
  };
}
