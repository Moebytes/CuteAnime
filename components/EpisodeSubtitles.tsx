/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useState, useContext, useMemo, useRef} from "react"
import {useThemeSelector, usePlaybackSelector, useFlagActions, useLayoutActions} from "../store"
import {EnglishCuesContext, JapaneseCuesContext} from "../App"
import functions from "../structures/Functions"
import CheckboxIcon from "../assets/svg/checkbox.svg"
import CheckboxCheckedIcon from "../assets/svg/checkbox-checked.svg"
import WatchIcon from "../assets/svg/watch.svg"
import "./styles/episodesubtitles.less"

interface Props {
    ep: string
}

const EpisodeSubtitles: React.FunctionComponent<Props> = (props) => {
    const {setEnableDrag} = useLayoutActions()
    const {siteColorChange} = useThemeSelector()
    const {setJumpFlag} = useFlagActions()
    const {subtitleIndexJA, } = usePlaybackSelector()
    const {japaneseCues} = useContext(JapaneseCuesContext)
    const {englishCues} = useContext(EnglishCuesContext)
    const [showSubtitleTranslation, setShowSubtitleTranslation] = useState(false)
    const [lastElement, setLastElement] = useState(null) as any
    const containerRef = useRef(null) as any

    const getFilter = (active?: boolean) => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = active ? bodyStyles.getPropertyValue("--activeSubtitles") : bodyStyles.getPropertyValue("--textColor")
        return functions.calculateFilter(color)
    }

    const getSortedCues = () => {
        if (!japaneseCues || !englishCues) return []
        const cueArray = [] as any
        for (let i = 0; i < japaneseCues.length; i++) {
            const cue = japaneseCues[i] as VTTCue
            let englishCueArr = Array.from(englishCues).filter((c: any) => functions.between(cue.startTime, c.startTime, c.endTime) ||
            functions.between(c.startTime, cue.startTime, cue.endTime)).map((c: any) => c.text) as any[]
            cueArray.push({
                text: functions.cleanSubs(cue.text),
                englishText: functions.cleanSubs(englishCueArr.join(" ") || "")
            })
        }
        return cueArray
    }

    const sortedCues = useMemo(() => {
        return getSortedCues()
    }, [japaneseCues, englishCues]) as any

    const generateJSX = () => {
        let jsx = [] as any
        for (let i = 0; i < sortedCues.length; i++) {
            jsx.push(
                <div className="episode-subtitles-cue" onMouseEnter={() => setEnableDrag(false)}>
                    <div className="episode-subtitles-cue-row">
                        <WatchIcon className="episode-subtitles-cue-marker" onClick={() => setJumpFlag(i)}/>
                        <span className="episode-subtitles-cue-text">{sortedCues[i].text}</span>
                    </div>
                    {showSubtitleTranslation ?
                    <div className="episode-subtitles-cue-row">
                        <span className="episode-subtitles-cue-text">{sortedCues[i].englishText}</span>
                    </div> : null}
                </div>
            )
        }
        return jsx
    }

    const subtitleJSX = useMemo(() => {
        return generateJSX()
    }, [sortedCues, showSubtitleTranslation, siteColorChange])

    useEffect(() => {
        const element = document.querySelectorAll(".episode-subtitles-cue").item(subtitleIndexJA) as HTMLDivElement
        if (lastElement) {
            lastElement.style.borderColor = "var(--buttonBG)"
            lastElement.querySelectorAll(".episode-subtitles-cue-text").forEach((e: any) => {
                e.style.color = "var(--textColor)"
            });
            (lastElement.querySelector(".episode-subtitles-cue-marker") as HTMLImageElement).style.color = "var(--textColor)"
        }
        if (element) {
            element.style.borderColor = "var(--activeSubtitles)"
            element.querySelectorAll(".episode-subtitles-cue-text").forEach((e: any) => {
                e.style.color = "var(--activeSubtitles)"
            });
            (element.querySelector(".episode-subtitles-cue-marker") as HTMLImageElement).style.color = "var(--activeSubtitles)"

            const container = document.querySelector(".episode-subtitles-subtitle-container") as HTMLDivElement
            if (container) {
                const middle = container.clientHeight / 3
                const lowBound = middle
                const highBound = container.scrollHeight - middle
                const elementPos = element.offsetTop
                if (elementPos > lowBound && elementPos < highBound) {
                    container.scrollTo({top: elementPos - middle, behavior: "smooth"})
                }
                if (elementPos >= highBound) {
                    container.scrollTo({top: container.scrollHeight, behavior: "smooth"})
                }
            }
        }
        setLastElement(element)
    }, [subtitleIndexJA, subtitleJSX])

    if (!japaneseCues || !englishCues) return null

    return (
        <div className="episode-subtitles" onMouseEnter={() => setEnableDrag(false)}>
            <div className="episode-subtitles-title-container">
                <div className="episode-subtitles-title-column">
                    <span className="episode-subtitles-title">Subtitles</span>
                </div>
                <div className="episode-subtitles-title-column">
                    {showSubtitleTranslation ?
                    <CheckboxCheckedIcon className="episode-subtitles-checkbox" onClick={() => setShowSubtitleTranslation((prev) => !prev)}/> :
                    <CheckboxIcon className="episode-subtitles-checkbox" onClick={() => setShowSubtitleTranslation((prev) => !prev)}/>}
                    <span className="episode-subtitles-title">Translated</span>
                </div>
            </div>
            <div className="episode-subtitles-subtitle-container" ref={containerRef}>
                {subtitleJSX}
            </div>
        </div>
    )
}

export default EpisodeSubtitles