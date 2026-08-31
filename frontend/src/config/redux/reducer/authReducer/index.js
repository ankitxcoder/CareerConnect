import { createSlice } from "@reduxjs/toolkit"
import { getAboutUser, loginUser, registerUser } from "../../action/authAction"

const initialState = {
    user: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    profileFetched : false,
    connections: [],
    connectionRequest: [],

}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        reset:()=> initialState,
        handleLoginUser:(state)=>{
            state.message = "hello"
        },
    },

    extraReducers: (builder) =>{

        builder
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true,
            state.message = "Knocking the door...";
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError = false,
            state.isSuccess = true,
            state.loggedIn = true;
            state.message = "Login is Successfull"

        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message= action.payload
        })

        .addCase(registerUser.pending,(state)=>{
            state.isLoading = true,
            state.message = "Registering you..."
        })

        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading = false,
            state.isError = false,
            state.isSuccess= true,
            state.loggedIn= false,
            state.message= {
                message: "Registration Is SuccessFull Please Sign in."
            }
        })

        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading = false,
            state.isError = true,
            state.message = action.payload
        })

        .addCase(getAboutUser.pending,(state)=>{
            state.isLoading=true;
        })

        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading= false;
            state.profileFetched= true;
            state.user = action.payload;
        })

        .addCase(getAboutUser.rejected,(state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        });
    }
});

export const {reset,handleLoginUser} = authSlice.actions;
export default authSlice.reducer;