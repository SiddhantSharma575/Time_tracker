import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./slices/projectsSlice";
import globalTimerReducer from "./slices/globalTimer";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import thunk from "redux-thunk";

// Separate persist configurations for each reducer
const projectsPersistConfig = {
  key: "projects",
  storage: AsyncStorage,
  // Add any blacklist or whitelist if necessary
  // blacklist: ['nonSerializableKey'],
  // whitelist: ['serializableKey'],
};

const globalTimerPersistConfig = {
  key: "globalTimer",
  storage: AsyncStorage,
  // Add any blacklist or whitelist if necessary
  //   blacklist: ["nonSerializableKey"],
  //   whitelist: ["serializableKey"],
  //   blacklist: ["register", "rehydrate"], // Specify keys that you don't want to persistr
};

const rootReducer = {
  projects: persistReducer(projectsPersistConfig, projectsReducer),
  globalTimer: persistReducer(globalTimerPersistConfig, globalTimerReducer),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
