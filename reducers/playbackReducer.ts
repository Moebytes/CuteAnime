/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const playbackSlice = createSlice({
    name: "playback",
    initialState: {
        speed: 1,
        subtitleIndexJA: 0,
        subtitleIndexEN: 0
    },
    reducers: {
        setSpeed: (state, action) => {state.speed = action.payload},
        setSubtitleIndexJA: (state, action) => {state.subtitleIndexJA = action.payload},
        setSubtitleIndexEN: (state, action) => {state.subtitleIndexEN = action.payload}
    }    
})

const {
    setSpeed, setSubtitleIndexJA, setSubtitleIndexEN
} = playbackSlice.actions

export const usePlaybackSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        speed: selector((state) => state.playback.speed),
        subtitleIndexJA: selector((state) => state.playback.subtitleIndexJA),
        subtitleIndexEN: selector((state) => state.playback.subtitleIndexEN)
    }
}

export const usePlaybackActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSpeed: (state: number) => dispatch(setSpeed(state)),
        setSubtitleIndexJA: (state: number) => dispatch(setSubtitleIndexJA(state)),
        setSubtitleIndexEN: (state: number) => dispatch(setSubtitleIndexEN(state))
    }
}

export default playbackSlice.reducer