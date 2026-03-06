import React, {useEffect, useState} from "react"
import {Routes, Route} from "react-router-dom"
import {useLayoutActions} from "./store"
import HomePage from "./pages/HomePage"
import AnimeInfoPage from "./pages/AnimeInfoPage"
import AnimePage from "./pages/AnimePage"
import AboutPage from "./pages/AboutPage"
import TermsPage from "./pages/TermsPage"
import $404Page from "./pages/404Page"
import "./index.less"

const App: React.FunctionComponent = () => {
    const {setMobile} = useLayoutActions()
    const [loaded, setLoaded] = useState(false)

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
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/anime" element={<HomePage/>}/>
                <Route path="/anime/:id" element={<AnimeInfoPage/>}/>
                <Route path="/anime/:id/:num" element={<AnimePage/>}/>
                <Route path="/about" element={<AboutPage/>}/>
                <Route path="/tos" element={<TermsPage/>}/>
                <Route path="/terms" element={<TermsPage/>}/>
                <Route path="/privacy" element={<TermsPage/>}/>
                <Route path="/*" element={<$404Page/>}/>
            </Routes>
        </div>
    )
}

export default App