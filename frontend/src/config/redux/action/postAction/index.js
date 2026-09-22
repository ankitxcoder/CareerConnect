import { createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "@/config";




export const getAllPosts = createAsyncThunk(
    "post/getAllPostsxyz",
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




export const createPost = createAsyncThunk(
    "post/createPost",
    async (userData,thunkAPI)=>{


        const {file , body} = userData;
        try{

            const formData = new FormData();
            formData.append("token", localStorage.getItem("token"))
            formData.append("body",body)
            formData.append("media",file)

            const response = await api.post("/post",formData, {
                headers:{
                    'Content-Type':"multipart/form-data"
                }
            });

            if(response.status == 200){
                return thunkAPI.fulfillWithValue("Post Uploaded");
            } else{
                return thunkAPI.rejectWithValue("Post Not Uploaded");

            }            



        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)



export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (post_id,thunkAPI)=>{
        try{
            const response = await api.delete("delete_post",{
                data:{
                    token:localStorage.getItem("token"),
                    post_id:post_id.post_id
                }
            });

            return thunkAPI.fulfillWithValue(response.data)
        }catch(erorr){
            return thunkAPI.rejectWithValue("someThing went Wrong")
        }
    }
)


export const incrementLike = createAsyncThunk(
    "post/incrementLike",
    async (postData,thunkAPI) =>
    {
        try{
            const response = await api.post("/increment_post_like",{
            
                    post_id: postData.post_id,
                
            })

        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)




export const getPostAllComments = createAsyncThunk(
    "post/getPostAllComments",
    async (postData,thunkAPI) =>{
        try{
            const response = await api.get("/get_comment_by_post",{
                params : {
                          post_id: postData.post_id
                }
                        })

            return thunkAPI.fulfillWithValue(response.data)

        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)




export const postComment = createAsyncThunk(
    "post/postComment",
    async (commentData,thunkAPI) =>{
        try{
            console.log(
                {post_id: commentData.post_id,
                body:commentData.body}
            )
            const response = await api.post("/comment_post",{
                token:localStorage.getItem("token"),
                post_id : commentData.post_id,
                commentBody: commentData.body
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)