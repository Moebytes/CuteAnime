/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {configureStore} from "@reduxjs/toolkit"
import themeReducer, {useThemeSelector, useThemeActions} from "./reducers/themeReducer"
import layoutReducer, {useLayoutSelector, useLayoutActions} from "./reducers/layoutReducer"
import searchReducer, {useSearchSelector, useSearchActions} from "./reducers/searchReducer"
import flagReducer, {useFlagSelector, useFlagActions} from "./reducers/flagReducer"
import filterReducer, {useFilterSelector, useFilterActions} from "./reducers/filterReducer"
import playbackReducer, {usePlaybackSelector, usePlaybackActions} from "./reducers/playbackReducer"

const store = configureStore({
    reducer: {
        theme: themeReducer,
        layout: layoutReducer,
        search: searchReducer,
        flag: flagReducer,
        filter: filterReducer,
        playback: playbackReducer
    }
})

export type StoreState = ReturnType<typeof store.getState>
export type StoreDispatch = typeof store.dispatch

export {
    useThemeSelector, useThemeActions,
    useLayoutSelector, useLayoutActions,
    useSearchSelector, useSearchActions,
    useFlagSelector, useFlagActions,
    useFilterSelector, useFilterActions,
    usePlaybackSelector, usePlaybackActions
}

export default store