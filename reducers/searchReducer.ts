/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import {createSlice} from "@reduxjs/toolkit"
import {useSelector, useDispatch} from "react-redux"
import type {StoreState, StoreDispatch} from "../store"

const searchSlice = createSlice({
    name: "search",
    initialState: {
        sidebarSort: "recent",
        sort: "date",
        reverse: false,
        genre: "",
        search: ""
    },
    reducers: {
        setSidebarSort: (state, action) => {state.sidebarSort = action.payload},
        setSort: (state, action) => {state.sort = action.payload},
        setReverse: (state, action) => {state.reverse = action.payload},
        setGenre: (state, action) => {state.genre = action.payload},
        setSearch: (state, action) => {state.search = action.payload}
    }    
})

const {
    setSidebarSort, setSort, setReverse, setGenre, setSearch
} = searchSlice.actions

export const useSearchSelector = () => {
    const selector = useSelector.withTypes<StoreState>()
    return {
        sidebarSort: selector((state) => state.search.sidebarSort),
        sort: selector((state) => state.search.sort),
        reverse: selector((state) => state.search.reverse),
        genre: selector((state) => state.search.genre),
        search: selector((state) => state.search.search)
    }
}

export const useSearchActions = () => {
    const dispatch = useDispatch.withTypes<StoreDispatch>()()
    return {
        setSidebarSort: (state: string) => dispatch(setSidebarSort(state)),
        setSort: (state: string) => dispatch(setSort(state)),
        setReverse: (state: boolean) => dispatch(setReverse(state)),
        setGenre: (state: string) => dispatch(setGenre(state)),
        setSearch: (state: string) => dispatch(setSearch(state))
    }
}

export default searchSlice.reducer