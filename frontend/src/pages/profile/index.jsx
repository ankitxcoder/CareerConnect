import { BASE_URL } from "@/config";
import {
  update_user_profile,
  updateProfileDetails,
  updateUserDetails,
} from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function MyProfile() {
  const userProfileLaRha = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({ name: "", bio: "", pastWork: [] });

  useEffect(() => {
    if (userProfileLaRha.message === "Profile picture uploaded") {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }
  }, [userProfileLaRha.message]);

  const updateUserProfile = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    dispatch(update_user_profile(formData));
  };

  const handle_edit = () => {
    setEditData({
      name: userProfileLaRha.user?.userId?.name || "",
      bio: userProfileLaRha.user?.bio || "",
      pastWork: userProfileLaRha.user?.pastWork || [],
    });
    setIsEditing(true);
  };

  const handleWorkChnage = (index, field, value) => {
    const newWork = [...editData.pastWork];
    // Specific object ka naya clone bana kar usme field update kar rahe hain
    newWork[index]={...newWork[index],[field]:value};
    setEditData({ ...editData, pastWork: newWork });
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");

    dispatch(updateUserDetails({ token, name: editData.name }));

    dispatch(
      updateProfileDetails({
        token,
        bio: editData.bio,
        pastWork: editData.pastWork,
      }),
    );
    console.log("saving data", editData);
    setIsEditing(false);
  };

  return (
    <UserLayout>
      {showSuccess && (
        <div className=" fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl z-50 shadow-xl">
          <h1 className="font-bold"> Profile updated Successfully! </h1>
        </div>
      )}
      <DashBoardLayout>
        {!userProfileLaRha.user ? (
          <div>Loading Profile...</div>
        ) : (
          <div className="profileHeader">
            <div className=" relative h-50 w-full bg-cover bg-center bg-[url(https://cdn.pixabay.com/photo/2022/04/15/07/58/sunset-7133867_1280.jpg)]">
              <img
                className="absolute object-cover -bottom-10 left-10 w-28 h-28 rounded-full"
                src={`${BASE_URL}/${userProfileLaRha.user.userId?.profilePicture}`}
              ></img>

              <div
                className="absolute -bottom-10 left-10 w-28 h-28 rounded-full hover:bg-black/50 flex items-center justify-center text-transparent hover:text-white transition-all duration-500  ease-in-out cursor-pointer"
                onClick={() => fileRef.current.click()}
              >
                Edit
              </div>
              <input
                type="file"
                hidden
                ref={fileRef}
                accept="*image/*"
                onChange={updateUserProfile}
              ></input>
            </div>



            <div className="mt-15">
              {isEditing ? (
                <div className="flex flex-col mt-15 pl-5 ">
                  {/* <h1>{userProfileLaRha.user.userId?.name}</h1> */}
                  <input
                    value={editData.name}
                    onChange={(e) => {
                      setEditData({ ...editData, name: e.target.value });
                    }}
                  />
                  {/* <h1>@{userProfileLaRha.user.userId?.userName}</h1> */}
                  <textarea
                    value={editData.bio}
                    onChange={(e) => {
                      setEditData({ ...editData, bio: e.target.value });
                    }}
                  />
                  {/* <h1>{userProfileLaRha.user.bio}</h1> */}
                  <h1> Work History</h1>
                  {editData.pastWork.map((work, index) => (
                    <div key={index}>
                      <input
                        value={work.company || ""}
                        onChange={(e) => {
                          handleWorkChnage(index, "company", e.target.value);
                        }}
                      />
                      <input
                        value={work.position || ""}
                        onChange={(e) => {
                          handleWorkChnage(index, "position", e.target.value);
                        }}
                      />
                      <input
                        value={work.year || ""}
                        onChange={(e) => {
                          handleWorkChnage(index, "year", e.target.value);
                        }}
                      />
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditData({
                        ...editData,
                        pastWork: [
                          ...editData.pastWork,
                          { company: "", position: "", year: "" },
                        ],
                      })
                    }
                  >
                    + Add Work Experience
                  </button>
                  <div>
                    <button onClick={handleSave}>Save Profile</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <button onClick={handle_edit}>Edit All Info</button>
                  <h1>{userProfileLaRha.user.userId?.name}</h1>
                  <h1>@{userProfileLaRha.user.userId?.userName}</h1>
                  <h1>{userProfileLaRha.user.bio}</h1>
                  <div>
                    <h1>Work History</h1>
                    {userProfileLaRha.user.pastWork?.map((work, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md hover:shadow-300 border border-gray-100 p-6 flex flex-col relative overflow-hidden"
                      >
                        <p className="">{work.company}</p>
                        <p>{work.position}</p>
                        <p>{work.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DashBoardLayout>
    </UserLayout>
  );
}

export default MyProfile;
