import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/config";

export const loginUser = createAsyncThunk(
    "user/login",
    async (user, thunkAPI) => {

        try{
            const response = await api.post(`/login`,{
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
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)



export const registerUser = createAsyncThunk(
    "user/register",
    async (user,thunkAPI)=>{
        console.log("registering");

        try{
            const response = await api.post("/register",{
                name: user.name,
                userName: user.userName,
                email: user.email,
                password: user.password,
                
            });

            return thunkAPI.fulfillWithValue(response.data);
        } catch(err) {
            return thunkAPI.rejectWithValue(err.response.data)
        }
        
    }

)


export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{


        try{

            console.log(user.token)
            const response = await api.get("/getUserAndProfile",{
               //get request hai th token ko params ke andar dalna pdega
               params: {
                token : user.token
               }
            })

            return thunkAPI.fulfillWithValue(response.data)
        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)