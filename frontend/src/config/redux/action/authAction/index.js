import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {

        try{
            const response = await clientServer.post(`/login`,{
                "password": user.password,
                "email": user.email
            });

            if (response.data.token){
                localStorage.setItem("token", response.data.token);
            } else {
                return thunkAPI.rejectWithValue({
                    messsage: "token not Provided"
                })
            }

            return thunkAPI.fulfillWithValue(response.data.token);
        } catch(err){
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)



export const registerUser = createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        
    }

)