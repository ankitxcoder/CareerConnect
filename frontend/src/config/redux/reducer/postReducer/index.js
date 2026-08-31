import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts } from "../../action/postAction";




// Starting memory
const initialState = {
    posts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

//Slice Creating -- Memory box
const postSlice = createSlice({
    name:"posts",
    initialState,
    reducers: {
        resetPost: () => initialState,
    },

    extraReducers: (builder) =>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading = true;
            state.message = "Fetching Posts...";
        })

        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;

            state.posts = action.payload.posts; //save the posts into our state
        })

        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            

            state.message = action.payload;   //save the error message
        });
    }

});

export const { resetPost } = postSlice.actions;
export default postSlice.reducer;
