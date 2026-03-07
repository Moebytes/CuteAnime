/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {useLayoutSelector, useLayoutActions, useSearchSelector, 
useSearchActions, useFlagActions} from "../store"
import {useNavigate, useLocation} from "react-router-dom"
import RecentIcon from "../assets/svg/recent.svg"
import GenreIcon from "../assets/svg/genre.svg"
import SearchIcon from "../assets/svg/search.svg"
import dbFunctions from "../structures/DatabaseFunctions"
import functions from "../structures/Functions"
import "./styles/sidebar.less"

const SideBar: React.FunctionComponent= () => {
    const {mobile} = useLayoutSelector()
    const {sidebarSort} = useSearchSelector()
    const {setSidebarSort, setGenre} = useSearchActions()
    const navigate = useNavigate()
    const location = useLocation()

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--sidebarLink")
        return functions.calculateFilter(color)
    }

    const generateLinksJSX = () => {
        let jsx = [] as any
        if (sidebarSort === "recent") {
            const recent = dbFunctions.getRecent()
            let max = recent.length < 22 ? recent.length : 22
            for (let i = 0; i < recent.length; i++) {
                jsx.push(<span className="sidebar-link" onClick={() => navigate(`/anime/${recent[i].id}`)}>{recent[i].title}</span>)
            }
        } else if (sidebarSort === "genre") {
            const genres = dbFunctions.getGenres()
            for (let i = 0; i < genres.length; i++) {
                const click = () => {
                    if (location.pathname !== "/" && location.pathname !== "/anime" && location.pathname !== "/home") navigate("/anime")
                    setGenre(genres[i])
                }
                jsx.push(<span className="sidebar-link" onClick={click}>{genres[i]}</span>)
            }
        }
        if (sidebarSort === "recent") {
            return <div className="sidebar-scroll-container">{jsx}</div>
        }
        return jsx
    }

    if (mobile) return null

    return (
        <>
        <div className={`sidebar`}>
            <div className="sidebar-container">
                <div className="sidebar-content">
                    <span className="sidebar-text">
                        Learn Japanese the fun way by watching anime!
                    </span>
                    <div className="sidebar-button-container">
                        <button className="sidebar-button" onClick={() => {setSidebarSort("recent"); setGenre("")}}>
                            <span className="sidebar-button-hover" style={{filter: sidebarSort === "recent" ? getFilter() : ""}}>
                                <RecentIcon className="sidebar-button-img"/>
                                <span className="sidebar-button-text">Recent</span>
                            </span>
                        </button>
                        <button className="sidebar-button" onClick={() => setSidebarSort("genre")}>
                            <span className="sidebar-button-hover" style={{filter: sidebarSort === "genre" ? getFilter() : ""}}>
                                <GenreIcon className="sidebar-button-img"/>
                                <span className="sidebar-button-text">Genre</span>
                            </span>
                        </button>
                    </div>
                    <div className="sidebar-link-container">
                        {generateLinksJSX()}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default SideBar