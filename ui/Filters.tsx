import React from "react"
import Slider from "react-slider"
import BrightnessIcon from "../assets/svg/brightness.svg"
import ContrastIcon from "../assets/svg/contrast.svg"
import HueIcon from "../assets/svg/hue.svg"
import SaturationIcon from "../assets/svg/saturation.svg"
import LightnessIcon from "../assets/svg/lightness.svg"
import BlurIcon from "../assets/svg/blur.svg"
import SharpenIcon from "../assets/svg/sharpen.svg"
import PixelateIcon from "../assets/svg/pixelate.svg"
import InvertIcon from "../assets/svg/invert.svg"
import InvertOnIcon from "../assets/svg/invert-on.svg"
import {useFilterActions, useFilterSelector, useLayoutSelector} from "../store"
import "./styles/filters.less"

interface Props {
    active: boolean
    right: number
    top: number
}

const Filters: React.FunctionComponent<Props> = (props) => {
    const {mobile} = useLayoutSelector()
    const {brightness, contrast, hue, saturation, lightness, 
        blur, sharpen, pixelate, invert} = useFilterSelector()
    const {setBrightness, setContrast, setHue, setSaturation, setLightness, 
        setBlur, setSharpen, setPixelate, setInvert, resetImageFilters} = useFilterActions()

    const imageFiltersJSX = () => {
        return (
            <>
            <div className="filter-dropdown-row filter-row">
                <BrightnessIcon className="filter-dropdown-img"/>
                <span className="filter-dropdown-text">Brightness</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setBrightness(value)} min={60} max={140} step={1} value={brightness}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <ContrastIcon className="filter-dropdown-img" style={{marginLeft: "7px", marginRight: "-7px"}}/>
                <span className="filter-dropdown-text">Contrast</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setContrast(value)} min={60} max={140} step={1} value={contrast}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <HueIcon className="filter-dropdown-img" style={{marginLeft: "20px", marginRight: "-20px"}}/>
                <span className="filter-dropdown-text">Hue</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setHue(value)} min={150} max={210} step={1} value={hue}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <SaturationIcon className="filter-dropdown-img"/>
                <span className="filter-dropdown-text">Saturation</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setSaturation(value)} min={60} max={140} step={1} value={saturation}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <LightnessIcon className="filter-dropdown-img"/>
                <span className="filter-dropdown-text">Lightness</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setLightness(value)} min={60} max={140} step={1} value={lightness}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <BlurIcon className="filter-dropdown-img" style={{marginLeft: "20px", marginRight: "-20px"}}/>
                <span className="filter-dropdown-text">Blur</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setBlur(value)} min={0} max={2} step={0.1} value={blur}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <SharpenIcon className="filter-dropdown-img" style={{marginLeft: "8px", marginRight: "-8px"}}/>
                <span className="filter-dropdown-text">Sharpen</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setSharpen(value)} min={0} max={5} step={0.1} value={sharpen}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <PixelateIcon className="filter-dropdown-img"/>
                <span className="filter-dropdown-text">Pixelate</span>
                <Slider className="filter-slider" trackClassName="filter-slider-track" thumbClassName="filter-slider-thumb" onChange={(value) => setPixelate(value)} min={1} max={10} step={0.1} value={pixelate}/>
            </div>
            <div className="filter-dropdown-row filter-row">
                <button className="filter-button" onClick={() => resetImageFilters()}>Reset</button>
                <button style={{marginLeft: "20px"}} className="filter-button" onClick={() => setInvert(!invert)}>
                    {invert ?
                    <InvertOnIcon className="filter-dropdown-img" style={{color: "black"}}/> :
                    <InvertIcon className="filter-dropdown-img" style={{color: "black"}}/>}
                </button>
            </div>
            </>
        )
    }

    const getMarginRight = () => {
        let raw = props.right
        let offset = 0
        return `${raw + offset}px`
    }

    const getMarginTop = () => {
        let raw = props.top
        let offset = 0
        if (mobile) offset += 60
        return `${raw + offset}px`
    }

    return (
        <div className={`filter-dropdown ${props.active ? "" : "hide-filter-dropdown"}`} 
        style={{marginRight: getMarginRight(), marginTop: getMarginTop(), transformOrigin: "bottom"}}>
                {imageFiltersJSX()}
        </div>
    )
}

export default Filters