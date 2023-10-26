import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSliceState } from "@/schema/userSlice";
import { User } from "@/modules/auth/schema/user";

const initialState: UserSliceState = {
    user: null,
    isTriedToAutoLogin: false,
    isNavOpen: false,
};
export const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User | undefined>) {
            if (action.payload) {
                state.user = action.payload;
            }
        },
        removeUser(state) {
            state.user = null;
        },
        setTriedToLogin(state, action: PayloadAction<boolean>) {
            state.isTriedToAutoLogin = action.payload;
        },

        setNavOpen(state){
            state.isNavOpen = !state.isNavOpen 
        }
    },
});
// export default UserSlice.reducer;
export const { setUser, removeUser, setTriedToLogin ,setNavOpen} = UserSlice.actions;
