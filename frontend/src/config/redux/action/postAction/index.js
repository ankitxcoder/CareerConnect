import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "@/config";




export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async (_, thunkAPI) => {
        try{

            const token = localStorage.getItem("token");

            const response = await api.get("/posts", {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });


            return thunkAPI.fulfillWithValue(response.data);


            
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);