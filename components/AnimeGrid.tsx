import React, {useEffect, useState} from "react"
import {useSearchSelector, useFlagSelector, useFlagActions, useLayoutSelector} from "../store"
import GridAnime from "./GridAnime"
import dbFunctions from "../structures/DatabaseFunctions"
import "./styles/animegrid.less"

const AnimeGrid: React.FunctionComponent = () => {
    const {mobile} = useLayoutSelector()
    const {search, genre, sort, reverse} = useSearchSelector()
    const {searchFlag} = useFlagSelector()
    const {setSearchFlag} = useFlagActions()
    const [animeList, setAnimeList] = useState([]) as any

    const updateAnimeList = () => {
        const list = dbFunctions.getSorted(search, genre, sort, reverse)
        setAnimeList(list)
    }

    useEffect(() => {
        updateAnimeList()
    }, [])

    useEffect(() => {
        if (searchFlag) setSearchFlag(false)
        updateAnimeList()
    }, [searchFlag, genre, sort, reverse])

    const generateJSX = () => {
        let jsx = [] as any
        let step = mobile ? 2 : 4
        for (let i = 0; i < animeList.length; i+=step) {
            let gridImages = [] as any
            for (let j = 0; j < step; j++) {
                const k = i+j
                if (!animeList[k]) break
                gridImages.push(<GridAnime img={animeList[k].cover} title={animeList[k].title} 
                    id={animeList[k].id} key={k} refresh={updateAnimeList}/>)
            }
            jsx.push(
                <div className="anime-grid-row">
                    {gridImages}
                </div>
            )

        }
        return jsx 
    }

    return (
        <div className="anime-grid">
            <div className="anime-grid-container">
                {generateJSX()}
            </div>
        </div>
    )
}

export default AnimeGrid