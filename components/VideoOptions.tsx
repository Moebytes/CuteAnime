/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState} from "react"
import {useLayoutSelector} from "../store"
import {useNavigate} from "react-router-dom"
import functions from "../structures/Functions"
import BackIcon from "../assets/svg/back.svg"
import BookmarkIcon from "../assets/svg/bookmark-filled.svg"
import SupportIcon from "../assets/svg/support.svg"
import DownloadIcon from "../assets/svg/download.svg"
import "./styles/videooptions.less"

interface Props {
    num: string
    info: {
        title: string
        id: string
        japaneseTitle: string
        studios: string[],
        aired: string
        added: string
        genres: string[]
        synopsis: string
        synopsisSource: string
        episodeSource: string
        website: string
        cover: string
        episodeCount: number
        ovaCount: number
        episodes: {
            episodeNumber: string | number
            title: string
            japaneseTitle: string
            synopsis: string
            thumbnail: string
            video: string
            japaneseSubs: string
            englishSubs: string
        }[]
    }
}

const VideoOptions: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const [saved, setSaved] = useState(false)
    const navigate = useNavigate()

    const num = props.num.includes("OVA") ? props.num : Number(props.num)

    const save = () => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        if (bookmarks[props.info.id]) {
            delete bookmarks[props.info.id]
            setSaved(false)
        } else {
            bookmarks[props.info.id] = true
            setSaved(true)
        }
        localStorage.setItem("bookmarks", JSON.stringify(bookmarks))
    }

    useEffect(() => {
        let bookmarkStr = localStorage.getItem("bookmarks")
        if (!bookmarkStr) bookmarkStr = "{}"
        const bookmarks = JSON.parse(bookmarkStr)
        setSaved(bookmarks[props.info.id] === true)
    }, [props.info.id])

    const downloadSubs = () => {
        const episode = props.info.episodes.find((e) => e.episodeNumber === num)
        if (episode) {
            functions.download(`${props.info.title} ${num}.vtt`, episode.japaneseSubs)
        }
    }

    return (
        <div className="video-options">
            <div className="video-options-container">
                <button className="video-options-button" onClick={() => navigate(`/anime/${props.info.id}`)}>
                    <span className="video-options-button-hover">
                        <BackIcon className="video-options-button-img"/>
                        <span className="video-options-button-text">{"Back"}</span>
                    </span>
                </button>
            </div>
            <div className="video-options-container">
                {!mobile ? <>
                <button className="video-options-button" onClick={downloadSubs}>
                    <span className="video-options-button-hover">
                        <DownloadIcon className="video-options-button-img"/>
                        <span className="video-options-button-text">{"Download Subs"}</span>
                    </span>
                </button>
                <button className="video-options-button" onClick={save}>
                    <span className="video-options-button-hover">
                        <BookmarkIcon className="video-options-button-img" style={{color: saved ? "var(--savedColor" : "var(--textColor)"}}/>
                        <span className="video-options-button-text" style={{color: saved ? "var(--savedColor" : "var(--textColor)"}}>{saved ? "Saved" : "Save"}</span>
                    </span>
                </button></> : null}
                <button className="video-options-button" onClick={() => window.open(props.info.website, "_blank")}>
                    <span className="video-options-button-hover">
                        <SupportIcon className="video-options-button-img"/>
                        <span className="video-options-button-text">{"Support"}</span>
                    </span>
                </button>
            </div>
        </div>
    )
}

export default VideoOptions