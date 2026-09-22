import { BASE_URL } from "@/config";
import { getAllUser } from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function Discover() {
  const authSate = useSelector((state) => state.auth);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!authSate.all_profile_fetched) {
      dispatch(getAllUser());
    }
  }, []);

  return (
    <UserLayout>
      <DashBoardLayout>
        <div className="allUserProfile">
          <div>
            {authSate.all_profile_fetched &&
              authSate.all_users.map((user) => {
                return (
                  <div
                    key={user._id}
                    onClick={() => {
                      router.push(`/view_profile/${user.userId?.userName}`);
                    }}
                    className="cursor-pointer"
                  >
                    <img
                      src={`${BASE_URL}/${user.userId?.profilePicture}`}
                      alt="profile_picture"
                    ></img>
                    <div>
                      <p>{user.userId?.name}</p>
                      <p>{user.userId?.userName}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default Discover;
