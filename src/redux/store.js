import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

import authReducer from "./auth/authSlice.js";
import assignmentReducer from "./assignment/assignmentSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  assignments: assignmentReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // persist only auth state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
