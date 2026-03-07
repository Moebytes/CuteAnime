/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useRef} from "react"
import {useLayoutSelector} from "../store"
import {useNavigate} from "react-router-dom"
import WatchIcon from "../assets/svg/watch.svg"
import BookmarkIcon from "../assets/svg/bookmark-filled.svg"
import "./styles/gridanime.less"

interface Props {
    img: string 
    title: string
    id: string
    genres: string[]
    episodes: number
    noButtons?: boolean
    refresh?: () => void
}

const GridAnime: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const [drag, setDrag] = useState(false)
    const [hover, setHover] = useState(false)
    const [saved, setSaved] = useState(false)
    const imageRef = useRef<HTMLImageElement>(null)
    const navigate = useNavigate()

    const imageAnimation = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return
        const rect = imageRef.current.getBoundingClientRect()
        const width = rect?.width
        const height = rect?.height
        const x = event.clientX - rect.x
        const y = event.clientY - rect.y
        const translateX = ((x / width) - 0.5) * 3
        const translateY = ((y / height) - 0.5) * 3
        imageRef.current.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(1.02)`
    }

    const cancelImageAnimation = () => {
        if (!imageRef.current) return
        imageRef.current.style.transform = "scale(1)"
    }

    const getFontSize = () => {
        let size = 20
        if (props.title.length <= 5) {
            size = 45
        } else if (props.title.length <= 10) {
            size = 35
        } else if (props.title.length <= 15) {
            size = 30
        } else if (props.title.length <= 25) {
            size = 25
        } else if (props.title.length <= 30) {
            size = 20
        } else {
            size = 20
        }
        if (mobile) size -= 7
        return `${size}px`
    }

    const onClick = (event: React.MouseEvent<HTMLElement>) => {
        if (event.metaKey || event.ctrlKey || event.button === 1) {
            event.preventDefault()
            const newWindow = window.open(`/anime/${props.id}`, "_blank")
            newWindow?.blur()
            window.focus()
        }
    }

    const mouseDown = (event: React.MouseEvent<HTMLElement>) => {
        setDrag(false)
    }

    const mouseMove = (event: React.MouseEvent<HTMLElement>) => {
        setDrag(true)
    }

    const mouseUp = async (event: React.MouseEvent<HTMLElement>) => {
        if (!drag) {
            if (event.metaKey || event.ctrlKey || event.button == 1) {
                return
            } else {
                navigate(`/anime/${props.id}`)
            }
        }
    }

    const save = () => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        if (bookmarks[props.id]) {
            delete bookmarks[props.id]
            setSaved(false)
        } else {
            bookmarks[props.id] = true
            setSaved(true)
        }
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
        props.refresh?.()
    }

    useEffect(() => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        setSaved(bookmarks[props.id] === true)
    }, [props.id])

    return (
        <div className="grid-anime">
            <div className="grid-anime-container">
                <div className="grid-anime-img-container" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onClick={onClick} onAuxClick={onClick} onMouseDown={mouseDown} onMouseUp={mouseUp} onMouseMove={mouseMove}>
                    <img className="grid-anime-img" src={props.img} ref={imageRef} onMouseMove={(event) => imageAnimation(event)} onMouseLeave={() => cancelImageAnimation()}/>
                </div>
                <div className="grid-anime-info-container">
                    <div className="grid-anime-title-container">
                        <span className="grid-anime-title">{props.title}</span>
                    </div>
                    <span className="grid-anime-episode-count">{props.episodes} episodes</span>
                    <div className="grid-anime-genre-container">
                        {props.genres.map((genre) => (<button className="grid-anime-genre-button">{genre}</button>))}
                    </div>
                    
                    {!props.noButtons ? <div className="grid-anime-button-container">
                        <button className="grid-anime-button" onClick={() => navigate(`/anime/${props.id}`)} onAuxClick={onClick}
                            style={{backgroundColor: "var(--buttonBG2)"}}>
                            <span className="grid-anime-button-hover">
                                <WatchIcon className="grid-anime-button-img" style={{color: "var(--buttonText)"}}/>
                                <span className="grid-anime-button-text" style={{color: "var(--buttonText)"}}>Watch</span>
                            </span>
                        </button>
                        <button className="grid-anime-button" onClick={save}>
                            <span className="grid-anime-button-hover2">
                                <BookmarkIcon className="grid-anime-button-img" style={{color: saved ? "var(--savedColor" : "var(--textColor)"}}/>
                                <span className="grid-anime-button-text" style={{color: saved ? "var(--savedColor" : "var(--textColor)"}}>
                                    {saved ? "Saved" : "Save"}</span>
                            </span>
                        </button>
                    </div> : null}
                </div>
            </div>
        </div>
    )
}

export default GridAnime