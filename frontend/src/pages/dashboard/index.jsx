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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

function Dashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileContent(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    setFileContent(null);
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
      setFilePreview(null);
    }
  };

  const handleUpload = async () => {
    if (!postContent.trim() && !fileContent) return;
    setIsPosting(true);
    try {
      await dispatch(createPost({ file: fileContent, body: postContent }));
      setPostContent("");
      removeSelectedFile();
      dispatch(getAllPosts());
    } finally {
      setIsPosting(false);
    }
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

  if (!authState.user) {
    return (
      <UserLayout>
        <DashBoardLayout>
          <div className="flex flex-col items-center justify-center min-h-[65vh] p-6 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20 animate-pulse">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 animate-spin"></div>
              </div>
            </div>
            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white tracking-tight mb-2">
              Connecting to Workspace
            </h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-4">
              Server is hosted on Render Free Tier. Cold boot in progress,
              please allow up to 10 seconds...
            </p>
            <div className="w-48 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 w-1/2 animate-[pulse_1.5s_infinite]"></div>
            </div>
          </div>
        </DashBoardLayout>
      </UserLayout>
    );
  }

  const currentUserAvatar =
    authState.user?.userId?.profilePicture &&
    authState.user.userId.profilePicture !== "undefined"
      ? authState.user.userId.profilePicture
      : DEFAULT_AVATAR;

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className="flex flex-col gap-6 max-w-2xl mx-auto pb-16 px-1 sm:px-0 w-full">
          <div className="relative overflow-hidden rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-5 sm:p-6 transition-all">
            <div className="flex items-start gap-4">
              <img
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20 shadow-md shrink-0 bg-zinc-100 dark:bg-zinc-800"
                src={currentUserAvatar}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                alt="My Profile"
              />
              <div className="flex-1 flex flex-col min-w-0">
                <textarea
                  onChange={(e) => setPostContent(e.target.value)}
                  value={postContent}
                  rows={3}
                  className="w-full bg-transparent text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-[15px] font-medium leading-relaxed resize-none focus:outline-none"
                  placeholder="What are you building or thinking about today?"
                />

                {filePreview && (
                  <div className="relative mt-3 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-white/10 w-fit max-w-xs group shadow-sm">
                    <img
                      src={filePreview}
                      alt="Upload Preview"
                      className="max-h-48 object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center text-xs transition-all shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-zinc-100 dark:border-white/5">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 cursor-pointer transition-all">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="text-xs font-bold">Attach Media</span>
                <input
                  onChange={handleFileChange}
                  className="hidden"
                  type="file"
                  accept="image/*,video/*"
                />
              </label>

              {(postContent.trim().length > 0 || fileContent) && (
                <button
                  onClick={handleUpload}
                  disabled={isPosting}
                  className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isPosting ? "Publishing..." : "Post"}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {postState.posts?.map((post) => {
              const authorAvatar =
                post.userId?.profilePicture &&
                post.userId.profilePicture !== "undefined"
                  ? post.userId.profilePicture
                  : DEFAULT_AVATAR;

              const isAuthor = post.userId?._id === authState.user?.userId?._id;

              return (
                <article
                  key={post._id}
                  className="relative overflow-hidden rounded-[2rem] border border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] p-5 sm:p-6 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      onClick={() =>
                        post.userId?.userName &&
                        router.push(`/view_profile/${post.userId.userName}`)
                      }
                      className="flex items-center gap-3.5 cursor-pointer group"
                    >
                      <img
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-zinc-100 dark:ring-zinc-800 group-hover:ring-indigo-500/40 transition-all shadow-sm shrink-0 bg-zinc-100 dark:bg-zinc-800"
                        src={authorAvatar}
                        onError={(e) => {
                          e.currentTarget.src = DEFAULT_AVATAR;
                        }}
                        alt="Author Avatar"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-zinc-900 dark:text-white text-[15px] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {post.userId?.name || "Member"}
                        </span>
                        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 truncate">
                          @{post.userId?.userName || "anonymous"}
                        </span>
                      </div>
                    </div>

                    {isAuthor && (
                      <button
                        onClick={async () => {
                          await dispatch(deletePost({ post_id: post._id }));
                          await dispatch(getAllPosts());
                        }}
                        title="Delete Post"
                        className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.75}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  {post.body && (
                    <p className="text-zinc-800 dark:text-zinc-200 text-[15px] font-normal leading-relaxed whitespace-pre-wrap mb-4">
                      {post.body}
                    </p>
                  )}

                  {post.media && post.media !== "" && (
                    <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800/80 mb-5 bg-zinc-950">
                      <img
                        className="w-full max-h-[550px] object-cover hover:scale-[1.01] transition-transform duration-500"
                        src={
                          post.media.startsWith("http")
                            ? post.media
                            : `${BASE_URL}/${post.media.split(/[\\/]/).pop()}`
                        }
                        alt="Post Attachment"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-white/5 text-zinc-500 dark:text-zinc-400">
                    <button
                      onClick={async () => {
                        await dispatch(incrementLike({ post_id: post._id }));
                        dispatch(getAllPosts());
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-all group"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      <span className="text-xs font-bold">
                        {post.likes ?? 0}
                      </span>
                    </button>

                    <button
                      onClick={async () => {
                        await dispatch(
                          getPostAllComments({ post_id: post._id }),
                        );
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 transition-all group"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"
                        />
                      </svg>
                      <span className="text-xs font-bold">Comments</span>
                    </button>

                    <button
                      onClick={() => {
                        const text = encodeURIComponent(
                          post.body || "Check out this post on CareerConnect!",
                        );
                        const url = encodeURIComponent(window.location.origin);
                        window.open(
                          `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                          "_blank",
                        );
                      }}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-500 transition-all group"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.75}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                        />
                      </svg>
                      <span className="text-xs font-bold">Share</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {postState.postId !== "" && (
          <div
            className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"
            onClick={() => dispatch(resetPostId())}
          >
            <div
              className="w-full max-w-xl h-[80vh] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                <h3 className="font-bold text-zinc-900 dark:text-white text-base">
                  Discussion Thread
                </h3>
                <button
                  onClick={() => dispatch(resetPostId())}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {postState.comments?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-sm gap-2">
                    <p>No comments yet. Start the conversation!</p>
                  </div>
                ) : (
                  postState.comments?.map((comment) => {
                    const commentAvatar =
                      comment.userId?.profilePicture &&
                      comment.userId.profilePicture !== "undefined"
                        ? comment.userId.profilePicture
                        : DEFAULT_AVATAR;

                    return (
                      <div
                        key={comment._id}
                        className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-white/5"
                      >
                        <img
                          className="w-9 h-9 rounded-full object-cover shrink-0 bg-zinc-100 dark:bg-zinc-800"
                          src={commentAvatar}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_AVATAR;
                          }}
                          alt="Commenter"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-zinc-900 dark:text-white">
                              {comment.userId?.name || "Member"}
                            </span>
                            <span className="text-[11px] text-zinc-400">
                              @{comment.userId?.userName}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1 leading-relaxed">
                            {comment.body}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!commentText.trim()) return;
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
                className="p-4 border-t border-zinc-100 dark:border-white/5 bg-white/50 dark:bg-zinc-900/50 flex items-center gap-3"
              >
                <input
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-5 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Reply
                </button>
              </form>
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}

export default Dashboard;
