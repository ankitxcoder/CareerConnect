import { BASE_URL } from "@/config";
import { getAboutUser, getAllUser } from "@/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllPosts,
  incrementLike,
  getPostAllComments,
  postComment,
} from "@/config/redux/action/postAction";
import { resetPost, resetPostId } from "@/config/redux/reducer/postReducer";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dashboard() {
  const router = useRouter();
  //talk to action to call getAllPosts
  const dispatch = useDispatch();
  //binoculars like pointing to store to get posts slice
  const postState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState();

  const handleUpload = async () => {
    console.log("Post Button is working");
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent(null);
    dispatch(getAllPosts());
  };

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.all_profile_fetched) {
      dispatch(getAllUser());
    }
  }, [authState.isTokenThere, dispatch]);

  useEffect(() => {
    if (postState.postId !== "") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [postState.postId]);

  if (authState.user) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className="scrollComponent flex flex-col gap-6 max-w-2xl mx-auto pb-10">
            <div className="createPostContainer flex flex-col gap-3 bg-fuchsia-200 dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 p-4 dark:border-gray-700 p-5">
              <div className="flex flex-row items-start gap-4 w-full">
                <img
                  className="w-12 rounded-full object-cover shadow-sm"
                  src={`${authState.user?.userId?.profilePicture}`}
                />
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none border border-gray-200 dark:border-gray-700 p-4 min-h-[100px] transition-all dark:text-white"
                  placeholder="what in Your Mind ?"
                ></textarea>
              </div>

              <div className="flex flex-row justify-end items-center gap-3 w-full ml-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                <label className="cursor-pointer ">
                  <div className="Fab flex  flex-col items-center rounded-full hover:bg-gray-50 cursor-pointer transition-colors text-gray-500 font-medium ">
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <p className="transition-all transform hover:-translate-y-0.5">
                      Media
                    </p>
                  </div>
                  <input
                    onChange={(e) => setFileContent(e.target.files[0])}
                    className="hidden"
                    type="file"
                  />
                </label>

                {postContent.length > 0 && (
                  <div
                    onClick={handleUpload}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 "
                  >
                    Post
                  </div>
                )}
              </div>
            </div>

            {/* starting feed from here  */}

            <div className="feedContainer flex flex-col gap-8 ">
              {postState.posts.map((post) => {
                return (
                  <div
                    key={post._id}
                    className="postSingleCard flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all duration-300 w-full max-w-2xl  max-h-[70vh]"
                  >
                    {/* Author Header */}
                    <div
                      className="feedSingleCard_profileContainer flex flex-row items-center 
                                             gap-4 mb-5"
                    >
                      <img
                        className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-gray-50 dark:border-gray-700"
                        src={`${BASE_URL}/${post.userId?.profilePicture}`}
                        alt="post auther profile"
                      />

                      <div className="flex flex-col justify-center">
                        <p className="font-extrabold text-gray-900 dark:text-white text-lg leading-none hover:text-blue-600 transition-colors">
                          {post.userId?.name}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                          @{post.userId?.userName}
                        </p>
                      </div>
                      {post.userId?._id === authState.user?.userId?._id && (
                        <div
                          onClickCapture={async () => {
                            await dispatch(deletePost({ post_id: post._id }));
                            await dispatch(getAllPosts());
                          }}
                          className=" justify-end ml-auto hover:text-red-400"
                          onClick={() => {}}
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
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Post text Body */}
                    <p className="text-gray-700 dark:text-gray-200 text-base mb-5 whitespace-pre-wrap leading-relaxed">
                      {post.body}
                    </p>
                    {post.media !== "" && (
                      <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm mb-5 ">
                        <img
                          className="w-full max-h-[600px] object-cover hover:scale-[1.01] transition-transform duration-500"
                          src={`${BASE_URL}/${post.media}`}
                          alt="post feed media"
                        />
                      </div>
                    )}

                    {/* Starting like comments share section here */}

                    <div className="postFunctions flex flex-row justify-around">
                      <div
                        className="postFunctions_like  flex flex-row gap-2 cursor-pointer"
                        onClick={async () => {
                          await dispatch(incrementLike({ post_id: post._id }));
                          dispatch(getAllPosts());
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 hover:scale-110"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                        <p>{post.likes}</p>
                      </div>
                      <div
                        className="postFunctions_comment"
                        onClick={async () => {
                          await dispatch(
                            getPostAllComments({ post_id: post._id }),
                          );
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
                            d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                          />
                        </svg>
                      </div>
                      <div
                        className="postFunction_share"
                        onClick={() => {
                          const text = encodeURIComponent(post.body);
                          const url = encodeURIComponent(
                            "http://localhost:3000",
                          );

                          const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                          window.open(twitterUrl, "_blank");
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
                            d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* comment Overlay inset comment dekhne ke liye yha se bnaya hu  */}
          {postState.postId != "" && (
            <div
              className="commentContainer fixed inset-0 z-50 backdrop-blur-1 bg-black/60 flex items-center justify-center p-4 "
              onClick={() => {
                dispatch(resetPostId());
              }}
            >
              {/* comment white box yha se start hota hai  */}

              <div
                className="allCommentContainer w-full max-w-2xl  h-[80vh] bg-gray-50 dark:bg-gray-700 rounded-2xl p-5 shadow-2xl overflow-hidden flex flex-col transform transition-all"
                onClick={(e) => {
                  e.stopPropagation(); //event ko parrent me propagte n krwaya jaye
                }}
              >
                <div className="p-4 border-b text-center">
                  <p className="font-medium">All Comments</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  {postState.comments.length === 0 && <p>No comments</p>}
                  {postState.comments.length !== 0 && (
                    <div>
                      {postState.comments.map((comment, index) => {
                        return (
                          <div
                            className="singleComment  flex flex-row items-start gap-4 border-b border-gray-100 hover:bg-gray-50 transition-colors w-full"
                            key={comment._id}
                          >
                            <div className="flex flex-row gap-3">
                              <img
                                className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200"
                                src={`${BASE_URL}/${comment.userId?.profilePicture}`}
                                alt=""
                              />
                              <div className=" flex flex-col">
                                <p className="text-xs text-gray-500 -mt-1">
                                  {comment.userId?.name}
                                </p>
                                <p className="text-xs text-gray-500 -mt-1">
                                  {comment.userId?.userName}
                                </p>
                                <p className="mt-2 text-sm text-gray-700">
                                  {comment.body}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="postCommentContainer  bg-white p-4 dark:text-gray-700 border-t border-gray-100 flex flex-row gap-4 items-center">
                  <input
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    type=""
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value);
                    }}
                    placeholder=" write a comment..."
                  />

                  <div
                    onClick={async () => {
                      // console.log(postState.postId);
                      await dispatch(
                        postComment({
                          post_id: postState.postId,
                          body: commentText,
                        }),
                      );
                      await dispatch(
                        getPostAllComments({ post_id: postState.postId }),
                      );

                      setCommentText("");
                    }}
                  >
                    <p className="button">post</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashBoardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashBoardLayout>
          <h1 className="font-bold">Loading...</h1>
        </DashBoardLayout>
      </UserLayout>
    );
  }
}

export default Dashboard;
