/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import Slider from "react-slider"
import LightIcon from "../assets/svg/light.svg"
import DarkIcon from "../assets/svg/dark.svg"
import {useThemeSelector, useThemeActions} from "../store"
import {Themes} from "../reducers/themeReducer"
import "./styles/hsldropdown.less"

interface Props {
    active: boolean
    top?: number
}

const HSLDropdown: React.FunctionComponent<Props> = (props) => {
    const {siteHue, siteSaturation, siteLightness, theme} = useThemeSelector()
    const {setTheme, setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()

    const lightChange = () => {
        let newTheme = ""
        if (theme.includes("light")) {
            newTheme = "dark"
        } else {
            newTheme = "light"
        }
        setTheme(newTheme as Themes)
    }

    const resetFilters = () => {
        setSiteHue(180)
        setSiteSaturation(100)
        setSiteLightness(50)
    }

    let style = {top: "70px"}

    return (
        <div className={`hsl-dropdown ${props.active ? "" : "hide-hsl-dropdown"}`} style={style}>
            <div className="hsl-dropdown-row">
                <span className="hsl-dropdown-text">Hue</span>
                <Slider className="hsl-dropdown-slider" trackClassName="hsl-dropdown-slider-track" thumbClassName="hsl-dropdown-slider-thumb" 
                onChange={(value) => setSiteHue(value)} min={60} max={272} step={1} value={siteHue}/>
            </div>
            <div className="hsl-dropdown-row">
                <span className="hsl-dropdown-text">Saturation</span>
                <Slider className="hsl-dropdown-slider" trackClassName="hsl-dropdown-slider-track" thumbClassName="hsl-dropdown-slider-thumb" 
                onChange={(value) => setSiteSaturation(value)} min={50} max={100} step={1} value={siteSaturation}/>
            </div>
            <div className="hsl-dropdown-row">
                <span className="hsl-dropdown-text">Lightness</span>
                <Slider className="hsl-dropdown-slider" trackClassName="hsl-dropdown-slider-track" thumbClassName="hsl-dropdown-slider-thumb" 
                onChange={(value) => setSiteLightness(value)} min={45} max={55} step={1} value={siteLightness}/>
            </div>
            <div className="hsl-dropdown-row" style={{justifyContent: "space-evenly"}}>
                <button className="hsl-dropdown-button" onClick={() => resetFilters()}>Reset</button>
                <button className="hsl-dropdown-button" onClick={() => lightChange()}>
                    {theme === "light" ? <DarkIcon className="hsl-dropdown-button-icon"/> : <LightIcon className="hsl-dropdown-button-icon"/>}
                </button>
            </div>
        </div>
    )
}

export default HSLDropdown