import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await api.post(`/login`, {
        password: user.password,
        email: user.email,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      } else {
        return thunkAPI.rejectWithValue({
          messsage: "token not Provided",
        });
      }

      return thunkAPI.fulfillWithValue(response.data.token);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    console.log("registering");

    try {
      const response = await api.post("/register", {
        name: user.name,
        userName: user.userName,
        email: user.email,
        password: user.password,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      console.log(user.token);
      const response = await api.get("/getUserAndProfile", {
        //get request hai th token ko params ke andar dalna pdega
        params: {
          token: user.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const getAllUser = createAsyncThunk(
  "user/getAllUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("./get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (data, thunkAPI) => {
    try {
      const response = await api.post("/user/send_connection_request", {
        token: data.token,
        connectionId: data.connectionId,
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);


export const getMyConnectionRequest = createAsyncThunk(
  "user/getConnectionRequest",
  async (getConnectionData, thunkAPI) => {
    try {
      const response = await api.get("/user/get_Connection_request", {
        params: {
          token: getConnectionData.token,
        },
      });

      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  },
);


export const getWhatAreMyConnectionRequest = createAsyncThunk(
  "user,getWhatAreMyConnectionRequest",
  async (getWhatAreMyConnectionRequestData,thunkAPI)=>{
    try{
        const response = await api.get("/user/user_connection_request", {
          params: {
            token: getWhatAreMyConnectionRequestData.token,
          },
        });

        return thunkAPI.fulfillWithValue(response.data);
    }catch(err){
        return thunkAPI.rejectWithValue(err.response.data.messsage)
    }
  }
);



export const acceptConnection = createAsyncThunk(
    "user,acceptConnecrion",
    async (acceptConnectionData,thunkAPI)=>{
        try{
            const response = await api.post("/user/accept_connection_request", {
              token: acceptConnectionData.token,
              reuestId: acceptConnectionData.reuestId,
              action_type: acceptConnectionData.action_type,
            });

            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data.messsage)
        }
    }
)