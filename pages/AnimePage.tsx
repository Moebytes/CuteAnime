import React, {useEffect, useReducer} from "react"
import {useLayoutActions, useLayoutSelector} from "../store"
import {useNavigate, useParams} from "react-router-dom"
import TitleBar from "../components/TitleBar"
import Sortbar from "../components/SortBar"
import Footer from "../components/Footer"
import VideoPlayer from "../components/VideoPlayer"
import EpisodeCarousel from "../components/EpisodeCarousel"
import VideoOptions from "../components/VideoOptions"
import EpisodeInfo from "../components/EpisodeInfo"
import EpisodeSubtitles from "../components/EpisodeSubtitles"
import functions from "../structures/Functions"
import database from "../json/database"
import episodes from "../json/episodes"
import "./styles/animepage.less"

interface Props {
    match?: any
}

const AnimePage: React.FunctionComponent<Props> = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {setEnableDrag} = useLayoutActions()
    const {mobile} = useLayoutSelector()
    const navigate = useNavigate()
    let {id, num} = useParams<{id: string, num: string}>()
    num = num?.replaceAll("+", " ")

    const info = database.find((m) => m.id === id)
    if (!info) {
        navigate(`/404`)
        return null
    }

    useEffect(() => {
        if (id) document.title = `${functions.toProperCase(id.replaceAll("-", " "))} ${num}`
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <Sortbar noButtons={true} anime={info.title} id={info.id} num={num} title={episodes[id][num ?? 0].title}/>
                <div className="anime-page-container">
                    <div className="anime-page-video-container">
                        <VideoPlayer info={info} num={num ?? ""}/>
                        <EpisodeCarousel info={info} num={num ?? ""}/>
                        <VideoOptions info={info} num={num ?? ""}/>
                    </div>
                    {!mobile ? 
                    <div className="anime-page-subtitle-container">
                        <EpisodeSubtitles ep={`${info.id} ${num}`}/>
                        <EpisodeInfo info={info} num={num ?? ""}/>
                    </div> : null}
                </div>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default AnimePage