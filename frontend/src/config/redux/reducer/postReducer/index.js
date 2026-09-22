import { createSlice } from "@reduxjs/toolkit";
import { getAllPosts, getPostAllComments } from "../../action/postAction";




// Starting memory
const initialState = {
    posts: [],
    postId: "",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    comments: [],
};

//Slice Creating -- Memory box
const postSlice = createSlice({
    name:"posts",
    initialState,
    reducers: {
        resetPost: () => initialState,
        resetPostId :(state)=>{
            state.postId = ""
        },
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

            state.posts = action.payload.posts.reverse(); //save the posts into our state
        })

        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            

            state.message = action.payload;   //save the error message
        })

        .addCase(getPostAllComments.fulfilled,(state,action)=>{
            state.postId = action.payload.post_id;
            state.comments = (action.payload.comments ?? []).reverse();
        
        });
    }

});



export const { resetPost,resetPostId } = postSlice.actions;
export default postSlice.reducer;
