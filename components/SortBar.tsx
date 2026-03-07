import React, {useEffect} from "react"
import {useLayoutSelector, useLayoutActions, useSearchSelector, useSearchActions, useFlagActions} from "../store"
import {useNavigate, useLocation} from "react-router-dom"
import functions from "../structures/Functions"
import DateIcon from "../assets/svg/date.svg"
import AlphabeticIcon from "../assets/svg/alphabetic.svg"
import BookmarkIcon from "../assets/svg/bookmark-filled.svg"
import DifficultyIcon from "../assets/svg/difficulty.svg"
import SortIcon from "../assets/svg/sort.svg"
import SortReverseIcon from "../assets/svg/sort-reverse.svg"
import SearchIcon from "../assets/svg/search.svg"
import "./styles/sortbar.less"

interface Props {
    noButtons?: boolean
    id?: string
    anime?: string
    title?: string
    num?: string
}

const SortBar: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {search, sort, sidebarSort, reverse} = useSearchSelector()
    const {setSearch, setSidebarSort, setSort, setReverse} = useSearchActions()
    const {setSearchFlag} = useFlagActions()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const savedSort = localStorage.getItem("sort")
        const savedSidebarSort = localStorage.getItem("sidebarSort")
        const savedReverse = localStorage.getItem("reverse")
        if (savedSort) setSort(savedSort)
        if (savedSidebarSort) setSidebarSort(savedSidebarSort)
        if (savedReverse) setReverse(JSON.parse(savedReverse))
    }, [])

    useEffect(() => {
        localStorage.setItem("sort", sort)
        localStorage.setItem("sidebarSort", sidebarSort)
        localStorage.setItem("reverse", JSON.stringify(reverse))
    }, [sort, sidebarSort, reverse])

    const getFilter = () => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = bodyStyles.getPropertyValue("--gridButton")
        return functions.calculateFilter(color)
    }

    const searchClick = () => {
        if (location.pathname !== "/" && location.pathname !== "/anime" && location.pathname !== "/home") navigate("/anime")
        setSearchFlag(true)
    }

    if (props.noButtons) {
        return (
            <div className="sortbar" style={{justifyContent: props.noButtons ? "flex-end" : "center"}}>
                {props.anime && props.num && props.title && props.id ? 
                <div className="sortbar-episode-container">
                    <span className="sortbar-anime-title" onClick={() => navigate(`/anime/${props.id}`)}>{props.anime}</span>
                    <span className="sortbar-episode-num">{props.num.includes("OVA") ? props.num : `Episode ${props.num}`}{!mobile ? " -" : ""}</span>
                    {!mobile ? <span className="sortbar-episode-title">{props.title}</span> : null}
                </div> : null}
                <div className="sortbar-search-container" onMouseEnter={() => setEnableDrag(false)}>
                    <input className="sortbar-search" type="search" spellCheck="false" value={search} onChange={(event) => setSearch(event.target.value)}/>
                    <button className="sortbar-search-button" onClick={searchClick}>
                        <span className="sortbar-search-button-hover">
                            <SearchIcon className="sortbar-search-button-img"/>
                        </span>
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="sortbar" style={{justifyContent: props.noButtons ? "flex-end" : "center"}}>
            <div className="sortbar-island">
                <div className="sortbar-button-container">
                    <button className="sortbar-button" onClick={() => setSort("date")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "date" ? getFilter() : ""}}>
                            <DateIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Date</span>
                        </span>
                    </button>
                    <button className="sortbar-button" onClick={() => setSort("alphabetic")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "alphabetic" ? getFilter() : ""}}>
                            <AlphabeticIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Alphabetic</span>
                        </span>
                    </button>
                    {!mobile ? <button className="sortbar-button" onClick={() => setSort("bookmarks")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "bookmarks" ? getFilter() : ""}}>
                            <BookmarkIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Bookmarks</span>
                        </span>
                    </button> : null}
                    {!mobile ? <button className="sortbar-button" onClick={() => setSort("difficulty")}>
                        <span className="sortbar-button-hover" style={{filter: sort === "difficulty" ? getFilter() : ""}}>
                            <DifficultyIcon className="sortbar-button-img"/>
                            <span className="sortbar-button-text">Difficulty</span>
                        </span>
                    </button> : null}
                    <button className="sortbar-button" onClick={() => setReverse(!reverse)}>
                        <span className="sortbar-button-hover">
                            {reverse ? 
                            <SortReverseIcon className="sortbar-button-img"/> :
                            <SortIcon className="sortbar-button-img"/>}
                        </span>
                    </button>
                </div>
                <div className="sortbar-search-container" onMouseEnter={() => setEnableDrag(false)}>
                    <input className="sortbar-search" type="search" spellCheck="false" value={search} onChange={(event) => setSearch(event.target.value)}/>
                    <button className="sortbar-search-button" onClick={searchClick}>
                        <span className="sortbar-search-button-hover">
                            <SearchIcon className="sortbar-search-button-img"/>
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SortBar