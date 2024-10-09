import { configureStore } from "@reduxjs/toolkit";
import peopleReducer from "../features/people/peopleSlice";
import organizationsReducer from "../features/organizations/organizationsSlice";
import requestsReducer from "../features/requests/requestsSlice";
import requestDetailsReducer from "../features/requests/requestDetailsSlice";
import messagesReducer from "../features/messages/messagesSlice";
import errorsReducer from "../features/errors/errorsSlice";
import tokenReducer from "../features/token/tokenSlice";

export const store = configureStore({
    reducer: {
        people: peopleReducer,
        organizations: organizationsReducer,
        token: tokenReducer,
        request: requestDetailsReducer,
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