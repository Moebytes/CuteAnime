import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import SideBar from "../components/SideBar"
import Sortbar from "../components/SortBar"
import MangaGrid from "../components/AnimeGrid"
import Footer from "../components/Footer"

const HomePage: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {setEnableDrag} = useLayoutActions()

    useEffect(() => {
        document.title = "CuteAnime: Watch Anime with Japanese subtitles"
    }, [])

    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <SideBar/>
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <Sortbar/>
                <MangaGrid/>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default HomePage