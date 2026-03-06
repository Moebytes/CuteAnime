import React, {useEffect} from "react"
import {useThemeSelector, useThemeActions} from "./store"
import functions from "./structures/Functions"
import {Themes} from "./reducers/themeReducer"

const lightColorList = {
	"--buttonBG": "#f9ddeb",
	"--textColor": "#801060",
	"--background": "#ffffff",
	"--sidebarBG": "#ffffff",
	"--navbarBG": "#faedf7",
	"--titleColor": "#ca6a9f",
	"--buttonText": "#ffffff",
	"--buttonBG2": "#e378ad",
	"--gridBG": "#faedf7",
	"--searchBorder": "#dfd2de",
	"--sidebarButton": "#f7d0e8"
}

const darkColorList = {
	"--buttonBG": "#3a1728",
	"--textColor": "#ffffff",
	"--background": "#231620",
	"--sidebarBG": "#241724",
	"--navbarBG": "#241721",
	"--titleColor": "#d34f9a",
	"--buttonText": "#000000",
	"--buttonBG2": "#ec63a7",
	"--gridBG": "#1c0f19",
	"--searchBorder": "#160915",
	"--sidebarButton": "#3a1d2f"
}

const LocalStorage: React.FunctionComponent = () => {
    const {theme, siteHue, siteSaturation, siteLightness} = useThemeSelector()
    const {setTheme, setSiteHue, setSiteSaturation, setSiteLightness} = useThemeActions()

    useEffect(() => {
        if (typeof window === "undefined") return
        const colorList = theme.includes("light") ? lightColorList : darkColorList
        let targetLightness = siteLightness
        if (theme.includes("light") && siteLightness > 50) targetLightness = 50
        let noRotation = [""]
        for (let i = 0; i < Object.keys(colorList).length; i++) {
            const key = Object.keys(colorList)[i]
            const color = Object.values(colorList)[i]
            if (noRotation.includes(key)) {
                document.documentElement.style.setProperty(key, color)
            } else {
                document.documentElement.style.setProperty(key, 
                    functions.rotateColor(color, siteHue, siteSaturation, targetLightness))
            }
        }
    }, [theme, siteHue, siteSaturation, siteLightness])


    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const savedSiteHue = localStorage.getItem("siteHue")
        const savedSiteSaturation = localStorage.getItem("siteSaturation")
        const savedSiteLightness = localStorage.getItem("siteLightness")
        
        if (savedTheme) setTheme(savedTheme as Themes)
        if (savedSiteSaturation) setSiteSaturation(Number(savedSiteSaturation))
        if (savedSiteHue) setSiteHue(Number(savedSiteHue))
        if (savedSiteLightness) setSiteLightness(Number(savedSiteLightness))
    }, [])

    useEffect(() => {
        localStorage.setItem("theme", theme)
        localStorage.setItem("siteHue", String(siteHue))
        localStorage.setItem("siteSaturation", String(siteSaturation))
        localStorage.setItem("siteLightness", String(siteLightness))
    }, [theme, siteHue, siteSaturation, siteLightness])

    return null
}

export default LocalStorage