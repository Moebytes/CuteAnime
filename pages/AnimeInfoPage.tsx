import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import {useNavigate, useParams} from "react-router-dom"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Footer from "../components/Footer"
import AnimeInfo from "../components/AnimeInfo"
import EpisodeGrid from "../components/EpisodeGrid"
import RelatedAnime from "../components/RelatedAnime"
import functions from "../structures/Functions"
import database from "../json/database"

interface Props {
    match?: any
}

const AnimeInfoPage: React.FunctionComponent<Props> = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {setEnableDrag} = useLayoutActions()
    const navigate = useNavigate()
    const {id} = useParams<{id: string}>()

    const info = database.find((m) => m.id === id)
    if (!info) {
        navigate(`/404`)
        return null
    }

    useEffect(() => {
        if (id) document.title = `${functions.toProperCase(id.replaceAll("-", " "))}`
        localStorage.removeItem("secondsProgress")
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <SideBar/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <AnimeInfo info={info}/>
                <EpisodeGrid info={info}/>
                <RelatedAnime info={info}/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default AnimeInfoPage