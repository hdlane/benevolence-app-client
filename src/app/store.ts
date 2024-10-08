import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "../features/people/peopleSlice";
import organizationsReducer from "../features/organizations/organizationsSlice";
import requestsReducer from "../features/requests/requestsSlice";
import messagesReducer from "../features/messages/messagesSlice";
import errorsReducer from "../features/errors/errorsSlice";

export const store = configureStore({
    reducer: {
        people: peopleReducer,
        organizations: organizationsReducer,
        requests: requestsReducer,
        messages: messagesReducer,
        errors: errorsReducer,
    },
})
//
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
