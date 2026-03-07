/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const flagSlice = createSlice({
    name: "flag",
    initialState: {
        searchFlag: false,
        jumpFlag: null as number | null
    },
    reducers: {
        setJumpFlag: (state, action) => {state.jumpFlag = action.payload},
        setSearchFlag: (state, action) => {state.searchFlag = action.payload}
    }    
})

const {
    setJumpFlag, setSearchFlag
} = flagSlice.actions

export const useFlagSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        searchFlag: selector((state) => state.flag.searchFlag),
        jumpFlag: selector((state) => state.flag.jumpFlag)
    }
}

export const useFlagActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSearchFlag: (state: boolean) => dispatch(setSearchFlag(state)),
        setJumpFlag: (state: number | null) => dispatch(setJumpFlag(state))
    }
}

export default flagSlice.reducer