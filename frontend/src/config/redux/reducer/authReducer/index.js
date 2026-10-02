import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUser,
  getConnectionRequest,
  getMyConnectionRequest,
  getUserConnections,
  getWhatAreMyConnectionRequest,
  loginUser,
  registerUser,
  sendConnectionRequest,
  update_user_profile,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  isTokenThere: false,
  message: "",
  profileFetched: false,
  all_users: [],
  all_profile_fetched: false,
  connections: [],
  connectionRequest: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        ((state.isLoading = true), (state.message = "Knocking the door..."));
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login is Successfull";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(registerUser.pending, (state) => {
        ((state.isLoading = true), (state.message = "Registering you..."));
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        ((state.isLoading = false),
          (state.isError = false),
          (state.isSuccess = true),
          (state.loggedIn = false),
          (state.message = {
            message: "Registration Is SuccessFull Please Sign in.",
          }));
      })

      .addCase(registerUser.rejected, (state, action) => {
        ((state.isLoading = false),
          (state.isError = true),
          (state.message = action.payload));
      })

      .addCase(getAboutUser.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profileFetched = true;
        state.user = action.payload;
      })

      .addCase(getAboutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profile_fetched = true;
        state.all_users = action.payload.profiles;
      })

      .addCase(sendConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.message = "sending connection request...";
      })

      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = action.payload.message;
      })

      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getMyConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.connections = action.payload.connections || [];
      })

      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message;
      })

      .addCase(getWhatAreMyConnectionRequest.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(getWhatAreMyConnectionRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.connectionRequest = action.payload.connections || [];
      })

      .addCase(getWhatAreMyConnectionRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      .addCase(getUserConnections.pending, (state) => {
        state.isLoading = true;
        state.isError == false;
      })

      .addCase(getUserConnections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.getUserConnections = action.payload.myconnections;
      })

      .addCase(getUserConnections.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })


      .addCase(update_user_profile.pending,(state)=>{
        state.isLoading = true;
        state.isError = false;
      })

      .addCase(update_user_profile.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.isError = false;
        state.message = "Profile picture uploaded";
      })

      .addCase(update_user_profile.rejected,(state,action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });

      
  },
});

export const { reset, handleLoginUser, setTokenIsThere, setTokenIsNotThere } =
  authSlice.actions;
export default authSlice.reducer;
