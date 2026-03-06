import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const playbackSlice = createSlice({
    name: "playback",
    initialState: {
        speed: 1,
        japaneseCues: null as any,
        englishCues: null as any,
        subtitleIndexJA: 0,
        subtitleIndexEN: 0
    },
    reducers: {
        setSpeed: (state, action) => {state.speed = action.payload},
        setJapaneseCues: (state, action) => {state.japaneseCues = action.payload},
        setEnglishCues: (state, action) => {state.englishCues = action.payload},
        setSubtitleIndexJA: (state, action) => {state.subtitleIndexJA = action.payload},
        setSubtitleIndexEN: (state, action) => {state.subtitleIndexEN = action.payload}
    }    
})

const {
    setSpeed, setJapaneseCues, setEnglishCues, 
    setSubtitleIndexJA, setSubtitleIndexEN
} = playbackSlice.actions

export const usePlaybackSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        speed: selector((state) => state.playback.speed),
        japaneseCues: selector((state) => state.playback.japaneseCues),
        englishCues: selector((state) => state.playback.englishCues),
        subtitleIndexJA: selector((state) => state.playback.subtitleIndexJA),
        subtitleIndexEN: selector((state) => state.playback.subtitleIndexEN)
    }
}

export const usePlaybackActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSpeed: (state: number) => dispatch(setSpeed(state)),
        setJapaneseCues: (state: any) => dispatch(setJapaneseCues(state)),
        setEnglishCues: (state: any) => dispatch(setEnglishCues(state)),
        setSubtitleIndexJA: (state: number) => dispatch(setSubtitleIndexJA(state)),
        setSubtitleIndexEN: (state: number) => dispatch(setSubtitleIndexEN(state))
    }
}

export default playbackSlice.reducer