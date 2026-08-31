// action ko handel krne ke liye reducer bnate hai ,, aur reducer ko store ke andar daal dete haii 

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"

//  Steps For State Management
//  - Submit acction 
//  Handel action in its ReducerTyperegister here --> ReducerType

 const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postReducer
    }
 }) 


 export default store;