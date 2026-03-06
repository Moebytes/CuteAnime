import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

type Themes = "light" | "dark"

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme: "light" as Themes,
        siteHue: 180,
        siteSaturation: 100,
        siteLightness: 50,
        siteColorChange: false
    },
    reducers: {
        setTheme: (state, action) => {state.theme = action.payload},
        setSiteHue: (state, action) => {state.siteHue = action.payload},
        setSiteSaturation: (state, action) => {state.siteSaturation = action.payload},
        setSiteLightness: (state, action) => {state.siteLightness = action.payload},
        setSiteColorChange: (state, action) => {state.siteColorChange = action.payload}
    }    
})

const {
    setTheme, setSiteHue, setSiteSaturation, setSiteLightness, setSiteColorChange
} = themeSlice.actions

export const useThemeSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        theme: selector((state) => state.theme.theme),
        siteHue: selector((state) => state.theme.siteHue),
        siteSaturation: selector((state) => state.theme.siteSaturation),
        siteLightness: selector((state) => state.theme.siteLightness),
        siteColorChange: selector((state) => state.theme.siteColorChange)
    }
}

export const useThemeActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setTheme: (state: Themes) => dispatch(setTheme(state)),
        setSiteHue: (state: number) => dispatch(setSiteHue(state)),
        setSiteSaturation: (state: number) => dispatch(setSiteSaturation(state)),
        setSiteLightness: (state: number) => dispatch(setSiteLightness(state)),
        setSiteColorChange: (state: boolean) => dispatch(setSiteColorChange(state))
    }
}

export default themeSlice.reducer