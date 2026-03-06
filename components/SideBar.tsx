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
    const {setEnableDrag} = useLayoutActions()
    const {search, sidebarSort} = useSearchSelector()
    const {setSearch, setSidebarSort, setGenre} = useSearchActions()
    const {setSearchFlag} = useFlagActions()
    const [showSearchBar, setShowSearchBar] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--sidebarLink")
        return functions.calculateFilter(color)
    }

    const updateShowSearchBar = () => {
        const sidebar = document.querySelector(".sidebar") as HTMLElement
        const titlebar = document.querySelector(".titlebar") as HTMLElement
        if (!sidebar || !titlebar) return
        const height = titlebar.clientHeight
        if (window.scrollY > height) {
            setShowSearchBar(true)
        } else {
            setShowSearchBar(false)
        }
    }

    useEffect(() => {
        updateShowSearchBar()
    }, [])

    useEffect(() => {
        const scrollHandler = () => {
            updateShowSearchBar()
        }
        window.addEventListener("scroll", scrollHandler)
        return () => {
            setTimeout(() => {
                window.removeEventListener("scroll", scrollHandler)
            }, 10)
        }
    })

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

    const searchClick = () => {
        if (location.pathname !== "/" && location.pathname !== "/anime" && location.pathname !== "/home") navigate("/anime")
        setSearchFlag(true)
    }

    if (mobile) return null

    return (
        <>
        <div className={`sidebar`}>
            <div className="sidebar-container">
                <div className="sidebar-content">
                    <span className="sidebar-text">
                        A fun Japanese learning resource. <br/>
                        Watch anime with Japanese subtitles!
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
                    {showSearchBar ?
                    <div className="sidebar-search-container" onMouseEnter={() => setEnableDrag(false)}>
                        <input className="sidebar-search" type="search" placeholder="Anime name..." spellCheck="false" value={search} onChange={(event) => setSearch(event.target.value)}/>
                        <button className="sidebar-search-button" onClick={searchClick}>
                            <span className="sidebar-search-button-hover">
                                <SearchIcon className="sidebar-search-button-img"/>
                            </span>
                        </button>
                    </div>
                    : null}
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