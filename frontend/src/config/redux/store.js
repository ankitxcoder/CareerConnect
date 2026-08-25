// action ko handel krne ke liye reducer bnate hai ,, aur reducer ko store ke andar daal dete haii 

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";

//  Steps For State Management
//  - Submit acction 
//  Handel action in its ReducerTyperegister here --> ReducerType

 const store = configureStore({
    reducer:{
        auth:authReducer
    }
 }) 


 export default store;