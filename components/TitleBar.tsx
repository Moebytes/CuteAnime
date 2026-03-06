import React, {useState} from "react"
import {useLayoutSelector, useLayoutActions, useThemeSelector, useThemeActions} from "../store"
import {useNavigate} from "react-router-dom"
import favicon from "../assets/icons/favicon.png"
import functions from "../structures/Functions"
import LightIcon from "../assets/svg/light.svg"
import DarkIcon from "../assets/svg/dark.svg"
import Slider from "react-slider"
import "./styles/titlebar.less"

interface Props {
    rerender: () => void
}

const TitleBar: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {siteHue, siteSaturation, siteLightness, siteColorChange} = useThemeSelector()
    const {setSiteHue, setSiteSaturation, setSiteLightness, setSiteColorChange} = useThemeActions()
    const [activeDropdown, setActiveDropdown] = useState(false)
    const navigate = useNavigate()

    const resetFilters = () => {
        setSiteHue(180)
        setSiteSaturation(100)
        setSiteLightness(50)
        setTimeout(() => {
            props.rerender()
        }, 100)
    }

    const titleClick = () => {
        navigate("/")
    }

    return (
        <div className={`titlebar`} onMouseEnter={() => setEnableDrag(false)}>
            <div className="titlebar-logo-container" onClick={titleClick}>
                <span className="titlebar-hover">
                    <div className="titlebar-text-container">
                        <span className="titlebar-text">C</span>
                        <span className="titlebar-text">u</span>
                        <span className="titlebar-text">t</span>
                        <span className="titlebar-text">e</span>
                        <span className="titlebar-text">A</span>
                        <span className="titlebar-text">n</span>
                        <span className="titlebar-text">i</span>
                        <span className="titlebar-text">m</span>
                        <span className="titlebar-text">e</span>
                    </div>
                    <div className="titlebar-image-container">
                        <img className="titlebar-img" src={favicon}/>
                    </div>
                </span>
            </div>
            <div className="titlebar-container">
                <div className="titlebar-nav-container">
                    {!mobile ? <span className="titlebar-nav-text" onClick={() => navigate("/anime")}>Anime</span> : null}
                    {!mobile ? <span className="titlebar-nav-text" onClick={() => window.open(functions.isLocalHost() ? "http://localhost:8080" : "https://cutemanga.moe", "_blank")}>Manga</span> : null}
                    <span className="titlebar-nav-text" onClick={() => navigate("/about")}>About</span>
                </div>
                {!mobile ?
                <div className="titlebar-nav-container">
                    <LightIcon className="titlebar-nav-icon" onClick={() => setActiveDropdown((prev) => !prev)}/>
                </div> : null}
            </div>
            <div className={`dropdown ${activeDropdown ? "" : "hide-dropdown"}`}>
                <div className="dropdown-row">
                    <span className="dropdown-text">Hue</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteHue(value)} min={60} max={300} step={1} value={siteHue}/>
                </div>
                <div className="dropdown-row">
                    <span className="dropdown-text">Saturation</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteSaturation(value)} min={50} max={100} step={1} value={siteSaturation}/>
                </div>
                <div className="dropdown-row">
                    <span className="dropdown-text">Lightness</span>
                    <Slider className="dropdown-slider" trackClassName="dropdown-slider-track" thumbClassName="dropdown-slider-thumb" 
                    onChange={(value) => setSiteLightness(value)} min={45} max={55} step={1} value={siteLightness}/>
                </div>
                <div className="dropdown-row">
                    <button className="dropdown-button" onClick={() => resetFilters()}>Reset</button>
                </div>
            </div>
        </div>
    )
}

export default TitleBar