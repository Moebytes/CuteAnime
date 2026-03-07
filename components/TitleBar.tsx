import React, {useState} from "react"
import {useLayoutSelector, useLayoutActions, useThemeSelector, useThemeActions} from "../store"
import {useNavigate} from "react-router-dom"
import favicon from "../assets/icons/favicon.png"
import functions from "../structures/Functions"
import LightIcon from "../assets/svg/light.svg"
import DarkIcon from "../assets/svg/dark.svg"
import HSLDropdown from "../ui/HSLDropdown"
import Slider from "react-slider"
import "./styles/titlebar.less"

interface Props {
    rerender: () => void
}

const TitleBar: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {setEnableDrag} = useLayoutActions()
    const {theme, siteHue, siteSaturation, siteLightness} = useThemeSelector()
    const {setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()
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
                    <span className="titlebar-nav-text" onClick={() => navigate("/about")}>About</span>
                </div>
                {!mobile ?
                <div className="titlebar-nav-container">
                    {theme === "light" ?
                    <LightIcon className="titlebar-nav-icon" onClick={() => setActiveDropdown((prev) => !prev)}/> :
                    <DarkIcon className="titlebar-nav-icon" onClick={() => setActiveDropdown((prev) => !prev)}/>}
                </div> : null}
            </div>
            <HSLDropdown active={activeDropdown}/>
        </div>
    )
}

export default TitleBar