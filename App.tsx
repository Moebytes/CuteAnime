import React, {useEffect, useState} from "react"
import {Routes, Route} from "react-router-dom"
import {useLayoutActions} from "./store"
import LocalStorage from "./LocalStorage"
import HomePage from "./pages/HomePage"
import AnimeInfoPage from "./pages/AnimeInfoPage"
import AnimePage from "./pages/AnimePage"
import AboutPage from "./pages/AboutPage"
import $404Page from "./pages/404Page"
import "./index.less"

type JapaneseCuesContextType = {japaneseCues: TextTrackCueList | null, 
    setJapaneseCues: React.Dispatch<React.SetStateAction<TextTrackCueList | null>>}

export const JapaneseCuesContext = React.createContext<JapaneseCuesContextType>(
    {japaneseCues: null, setJapaneseCues: () => {}})

type EnglishCuesContextType = {englishCues: TextTrackCueList | null, 
    setEnglishCues: React.Dispatch<React.SetStateAction<TextTrackCueList | null>>}

export const EnglishCuesContext = React.createContext<EnglishCuesContextType>(
    {englishCues: null, setEnglishCues: () => {}})

const App: React.FunctionComponent = () => {
    const {setMobile} = useLayoutActions()
    const [loaded, setLoaded] = useState(false)
    const [japaneseCues, setJapaneseCues] = useState(null) as any
    const [englishCues, setEnglishCues] = useState(null) as any

    useEffect(() => {
        setTimeout(() => {
            setLoaded(true)
        }, 100)
    }, [])

    useEffect(() => {
        const mobileQuery = (query: any) => {
            if (query.matches) {
                setMobile(true)
            } else {
                setMobile(false)
            }
        }
        const media = window.matchMedia("(max-width: 500px)")
        media.addEventListener("change", mobileQuery)
        mobileQuery(media)
        document.documentElement.style.visibility = "visible"
    }, [])

    return (
        <div className={`app ${!loaded ? "stop-transitions" : ""}`}>
            <EnglishCuesContext.Provider value={{englishCues, setEnglishCues}}>
            <JapaneseCuesContext.Provider value={{japaneseCues, setJapaneseCues}}>
                <LocalStorage/>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/anime" element={<HomePage/>}/>
                    <Route path="/anime/:id" element={<AnimeInfoPage/>}/>
                    <Route path="/anime/:id/:num" element={<AnimePage/>}/>
                    <Route path="/about" element={<AboutPage/>}/>
                    <Route path="/*" element={<$404Page/>}/>
                </Routes>
            </JapaneseCuesContext.Provider>
            </EnglishCuesContext.Provider>
        </div>
    )
}

export default App