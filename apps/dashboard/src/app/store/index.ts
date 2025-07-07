// store/index.ts
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist"
import storage from "redux-persist/lib/storage"

import type { PropertyState } from "./property"
import type { TypedUseSelectorHook } from "react-redux"

import { propertyReducer } from "./property"

// Root state type
export interface RootState {
  property: PropertyState
  // Add other root-level state slices here
}

// Root reducer
const rootReducer = combineReducers({
  property: propertyReducer,
  // Add other root-level reducers here
})

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["property"], // Only persist property state
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Create store with middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Create persistor
export const persistor = persistStore(store)

// Typed versions of useDispatch and useSelector
type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Re-export everything from property module
export * from "./property"
