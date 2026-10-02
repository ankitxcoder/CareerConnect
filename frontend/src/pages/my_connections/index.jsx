import { BASE_URL } from "@/config";
import {
  acceptConnection,
  getMyConnectionRequest,
  getUserConnections,
} from "@/config/redux/action/authAction";
import DashBoardLayout from "@/layouts/DashboardLayout";
import UserLayout from "@/layouts/UserLayout";
import { makeErroringSearchParamsForUseCache } from "next/dist/server/request/search-params";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function MyConnections() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequest({ token: localStorage.getItem("token") }));
    dispatch(getUserConnections({ token: localStorage.getItem("token") }));
  }, []);


  
  return (
    <UserLayout>
      <DashBoardLayout>
        <div>
          <h4>My Connections</h4>

          {authState.connections.length === 0 ? (
            <p>No Pending Request</p>
          ) : (
            authState.connections.map((connection) => {
              return (
                <div
                  key={connection._id}
                  className="flex flex-row items-center bg-gray-100 p-4 rounded-lg gap-4"
                >
                  <img
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                    src={`${BASE_URL}/${connection.userId.profilePicture}`}
                    alt="Profile"
                  ></img>

                  <div>
                    <h1 className="font-bold text-xl">
                      {connection.userId.name}
                    </h1>
                    <p className="text-gray-500">
                      {connection.userId.userName}
                    </p>
                  </div>

                  <div className="ml-auto ">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md gap-2"
                      onClick={() => {
                        dispatch(
                          acceptConnection({
                            token: localStorage.getItem("token"),
                            requestId: connection._id,
                            action_type: "accept",
                          }),
                        )
                          .unwrap()
                          .then(() => {
                            dispatch(
                              getMyConnectionRequest({
                                token: localStorage.getItem("token"),
                              }),
                            );
                          });
                      }}
                    >
                      accept
                    </button>

                    <button
                      className="bg-red-500 hover:bgred-600 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        dispatch(
                          acceptConnection({
                            token: localStorage.getItem("token"),
                            requestId: connection._id,
                            action_type: "reject",
                          }),
                        );
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <div>
            <h4>My Network</h4>
            {authState.getUserConnections?.length === 0 ?(<p>No friends yet..</p>)
            : (authState.getUserConnections?.map((oneConnection)=>{
              const friend = (authState.user?.userId?._id === oneConnection.userId?._id) ? oneConnection.connectionId : oneConnection.userId;
              return (<div key={oneConnection._id}>
                <img src={`${BASE_URL}/${friend?.profilePicture}`} alt="profile image"></img>
                <h1>{friend?.name}</h1>
                <p>@{friend?.userName}</p>
             </div>)
            })

          )
        }
            
              
              </div>
     
            
            
       
    </div>
      </DashBoardLayout>
    </UserLayout>
  );
}

export default MyConnections;
