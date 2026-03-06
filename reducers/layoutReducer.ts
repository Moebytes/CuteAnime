import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        mobile: false,
        enableDrag: false
    },
    reducers: {
        setMobile: (state, action) => {state.mobile = action.payload},
        setEnableDrag: (state, action) => {state.enableDrag = action.payload},
    }    
})

const {
    setMobile, setEnableDrag
} = layoutSlice.actions

export const useLayoutSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        mobile: selector((state) => state.layout.mobile),
        enableDrag: selector((state) => state.layout.enableDrag)
    }
}

export const useLayoutActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setMobile: (state: boolean) => dispatch(setMobile(state)),
        setEnableDrag: (state: boolean) => dispatch(setEnableDrag(state))
    }
}

export default layoutSlice.reducer