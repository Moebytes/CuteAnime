import React, {useEffect, useState, useRef, useContext, useReducer, useMemo} from "react"
import {useLayoutActions, useThemeSelector, usePlaybackSelector, useFlagActions,
usePlaybackActions, useFilterSelector, useFilterActions, useFlagSelector} from "../store"
import {EnglishCuesContext, JapaneseCuesContext} from "../App"
import {useNavigate} from "react-router-dom"
import Slider from "react-slider"
import SpeedIcon from "../assets/svg/speed.svg"
import ClearIcon from "../assets/svg/revert.svg"
import PlayIcon from "../assets/svg/play.svg"
import PauseIcon from "../assets/svg/pause.svg"
import RewindIcon from "../assets/svg/rewind.svg"
import FastforwardIcon from "../assets/svg/fastforward.svg"
import PreservePitchIcon from "../assets/svg/pitch.svg"
import FullscreenIcon from "../assets/svg/fullscreen.svg"
import VolumeIcon from "../assets/svg/volume.svg"
import VolumeLowIcon from "../assets/svg/volume-low.svg"
import VolumeMuteIcon from "../assets/svg/volume-mute.svg"
import ABLoopIcon from "../assets/svg/abloop.svg"
import SubIcon from "../assets/svg/sub.svg"
import FXIcon from "../assets/svg/fx.svg"
import BrightnessIcon from "../assets/svg/brightness.svg"
import ContrastIcon from "../assets/svg/contrast.svg"
import HueIcon from "../assets/svg/hue.svg"
import SaturationIcon from "../assets/svg/saturation.svg"
import LightnessIcon from "../assets/svg/lightness.svg"
import BlurIcon from "../assets/svg/blur.svg"
import SharpenIcon from "../assets/svg/sharpen.svg"
import PixelateIcon from "../assets/svg/pixelate.svg"
import CheckboxIcon from "../assets/svg/checkbox.svg"
import CheckboxCheckedIcon from "../assets/svg/checkbox-checked.svg"
import functions from "../structures/Functions"
import "./styles/videoplayer.less"

interface Props {
    num: string
    info: {
        title: string
        id: string
        japaneseTitle: string
        studios: string[],
        aired: string
        added: string
        genres: string[]
        synopsis: string
        synopsisSource: string
        episodeSource: string
        website: string
        cover: string
        episodeCount: number
        ovaCount: number
        episodes: {
            episodeNumber: string | number
            title: string
            japaneseTitle: string
            synopsis: string
            thumbnail: string
            video: string
            japaneseSubs: string
            englishSubs: string
        }[]
    }
}

const VideoPlayer: React.FunctionComponent<Props> = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {setEnableDrag} = useLayoutActions()
    const {siteColorChange} = useThemeSelector()
    const {brightness, contrast, hue, saturation, lightness, 
        pixelate, invert, blur, sharpen} = useFilterSelector()
    const {setBrightness, setContrast, setHue, setSaturation, setLightness, 
        setPixelate, setInvert, setBlur, setSharpen} = useFilterActions()
    const {speed, subtitleIndexJA} = usePlaybackSelector()
    const {setSpeed, setSubtitleIndexJA, setSubtitleIndexEN} = usePlaybackActions()
    const {jumpFlag} = useFlagSelector()
    const {setJumpFlag} = useFlagActions()
    const {japaneseCues, setJapaneseCues} = useContext(JapaneseCuesContext)
    const {englishCues, setEnglishCues} = useContext(EnglishCuesContext)

    const [showSpeedDropdown, setShowSpeedDropdown] = useState(false)
    const [showVolumeSlider, setShowVolumeSlider] = useState(false)
    const [showSubtitleDropdown, setShowSubtitleDropdown] = useState(false)
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [videoLoaded, setVideoLoaded] = useState(false)
    const [backFrame, setBackFrame] = useState(null) as any
    const [secondsProgress, setSecondsProgress] = useState(0)
    const [progress, setProgress] = useState(0)
    const [dragProgress, setDragProgress] = useState(0) as any
    const [reverse, setReverse] = useState(false)
    const [volume, setVolume] = useState(0.5)
    const [previousVolume, setPreviousVolume] = useState(0)
    const [paused, setPaused] = useState(false)
    const [preservePitch, setPreservePitch] = useState(true)
    const [duration, setDuration] = useState(0)
    const [dragging, setDragging] = useState(false)
    const [seekTo, setSeekTo] = useState(null) as any
    const [subtitleTextJA, setSubtitleTextJA] = useState("") 
    const [subtitleTextEN, setSubtitleTextEN] = useState("")
    const [showJapaneseSubs, setShowJapaneseSubs] = useState(true)
    const [showEnglishSubs, setShowEnglishSubs] = useState(false)
    const [abloop, setABLoop] = useState(false)
    const [loopStart, setLoopStart] = useState(0)
    const [loopEnd, setLoopEnd] = useState(100)
    const [controlsVisible, setControlsVisible] = useState(false)
    const [subtitleHover, setSubtitleHover] = useState(false)
    const videoFiltersRef = useRef<HTMLDivElement>(null)
    const videoOverlayRef = useRef<HTMLCanvasElement>(null)
    const videoLightnessRef = useRef<HTMLImageElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const videoCanvasRef = useRef<HTMLCanvasElement>(null)
    const videoControls = useRef<HTMLDivElement>(null)
    const videoSliderRef = useRef<any>(null)
    const videoSpeedRef = useRef(null) as any
    const videoVolumeRef = useRef(null) as any
    const videoSubtitleRef = useRef(null) as any
    const videoFilterRef = useRef(null) as any
    const videoSpeedSliderRef = useRef<any>(null)
    const videoVolumeSliderRef = useRef<any>(null)
    const fullscreenRef = useRef<HTMLDivElement>(null)
    const abSlider = useRef(null) as any
    const subtitleRef = useRef(null) as any
    const navigate = useNavigate()

    const num = props.num.includes("OVA") ? props.num : Number(props.num)
    const episode = props.info.episodes.find((e) => e.episodeNumber === num)
    if (!episode) {
        navigate("/404")
        return null 
    }

    const video = episode.video 
    const japaneseSubs = episode.japaneseSubs
    const englishSubs = episode.englishSubs

    useEffect(() => {
        const savedSpeed = localStorage.getItem("speed")
        const savedPitch = localStorage.getItem("preservePitch")
        const savedVolume = localStorage.getItem("volume")
        const savedJASubs = localStorage.getItem("showJapaneseSubs")
        const savedENSubs = localStorage.getItem("showEnglishSubs")
        const savedProgress = localStorage.getItem("secondsProgress")
        if (savedSpeed) setSpeed(JSON.parse(savedSpeed))
        if (savedPitch) changePreservesPitch(JSON.parse(savedPitch))
        if (savedVolume) changeVolume(JSON.parse(savedVolume))
        if (savedJASubs) setShowJapaneseSubs(JSON.parse(savedJASubs))
        if (savedENSubs) setShowEnglishSubs(JSON.parse(savedENSubs))
        if (savedProgress) {
            setTimeout(() => {
                setSeekTo(JSON.parse(savedProgress))
            }, 500)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("speed", JSON.stringify(speed))
        localStorage.setItem("preservePitch", JSON.stringify(preservePitch))
        localStorage.setItem("volume", JSON.stringify(volume))
        localStorage.setItem("showJapaneseSubs", JSON.stringify(showJapaneseSubs))
        localStorage.setItem("showEnglishSubs", JSON.stringify(showEnglishSubs))
    }, [speed, preservePitch, volume, showJapaneseSubs, showEnglishSubs])

    useEffect(() => {
        reset()
        setVideoLoaded(false)
        setReverse(false)
        setSecondsProgress(0)
        setProgress(0)
        setDragProgress(0)
        setDuration(0)
        setDragging(false)
        setJapaneseCues(null)
        setEnglishCues(null)
        setSubtitleTextJA("")
        setSubtitleTextEN("")
        setSubtitleIndexJA(0)
        setSubtitleIndexEN(0)
        setControlsVisible(false)
        setSubtitleHover(false)
        if (videoRef.current) videoRef.current.style.opacity = "1"
    }, [num])

    useEffect(() => {
        if (videoSliderRef.current) videoSliderRef.current.resize()
        if (videoSpeedSliderRef.current) videoSpeedSliderRef.current.resize()
        if (videoVolumeSliderRef.current) videoVolumeSliderRef.current.resize()
    })

    useEffect(() => {
        const parseVideo = async () => {
            if (backFrame) return 
            setBackFrame(episode.thumbnail)
            if (videoLightnessRef.current && videoRef.current) {
                videoLightnessRef.current.width = videoRef.current.clientWidth
                videoLightnessRef.current.height = videoRef.current.clientHeight
            }
        }
        if (videoLoaded) parseVideo()
    }, [videoLoaded])

    const resizeVideoCanvas = () => {
        if (!videoCanvasRef.current || !videoRef.current || !videoOverlayRef.current || !videoLightnessRef.current) return
        if (videoRef.current.clientWidth === 0) return
        const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight
        const width = videoRef.current.clientWidth
        const height = videoRef.current.clientWidth / ratio
        videoCanvasRef.current.width = width
        videoCanvasRef.current.height = height
        videoOverlayRef.current.width = width
        videoOverlayRef.current.height = height
        videoLightnessRef.current.width = width
        videoLightnessRef.current.height = height
    }

    const exitFullScreen = async () => {
        // @ts-ignore
        if (!document.fullscreenElement && !document.webkitIsFullScreen) {
            await fullscreen(true)
            resizeVideoCanvas()
            forceUpdate()
        }
    }

    useEffect(() => {
        let observer = new ResizeObserver(resizeVideoCanvas)
        observer.observe(videoRef.current!)
        window.addEventListener("fullscreenchange", exitFullScreen)
        window.addEventListener("webkitfullscreenchange", exitFullScreen)
        return () => {
            observer?.disconnect()
            window.removeEventListener("fullscreenchange", exitFullScreen)
            window.removeEventListener("webkitfullscreenchange", exitFullScreen)
        }
    }, [])

    useEffect(() => {
        if (!dragging && dragProgress !== null) {
            setSecondsProgress(dragProgress)
            setProgress((dragProgress / duration) * 100)
            setDragProgress(null)
        }
    }, [dragging, dragProgress])

    useEffect(() => {
        const timeUpdate = () => {
            if (!videoRef.current) return
            const secondsProgress = videoRef.current.currentTime / videoRef.current.playbackRate
            const duration = videoRef.current.duration / videoRef.current.playbackRate
            if (abloop) {
                const current = videoRef.current.currentTime
                const start = reverse ? (videoRef.current.duration / 100) * (100 - loopStart) : (videoRef.current.duration / 100) * loopStart
                const end = reverse ? (videoRef.current.duration / 100) * (100 - loopEnd) : (videoRef.current.duration / 100) * loopEnd
                if (reverse) {
                    if (current > start || current < end) {
                        setSeekTo(end)
                    }
                } else {
                    if (current < start || current > end) {
                        videoRef.current.currentTime = start
                        setSeekTo(start)
                    }
                }
            }
            if (!dragging) {
                setSecondsProgress(secondsProgress)
                setProgress((secondsProgress / duration) * 100)
                setDuration(duration)
                localStorage.setItem("secondsProgress", JSON.stringify(secondsProgress))
            }
        }
        /*
        if (hover) {
            document.documentElement.style.setProperty("--subtitle-transform", "translateY(-80px)")
        } else {
            document.documentElement.style.setProperty("--subtitle-transform", "translateY(0)")
        }*/
        const keyDown = (event: KeyboardEvent) => {
            if (event.code === "Space") {
                event.preventDefault()
                setPaused((prev) => !prev)
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault()
                prevSub()
            }
            if (event.key === "ArrowRight") {
                event.preventDefault()
                nextSub()
            }
            if (event.key === "ArrowUp") {
                event.preventDefault()
                changeVolume(volume + 0.05)
            }
            if (event.key === "ArrowDown") {
                event.preventDefault()
                changeVolume(volume - 0.05)
            }
        }
        videoRef.current!.addEventListener("timeupdate", timeUpdate)
        window.addEventListener("keydown", keyDown)
        return () => {
            videoRef.current?.removeEventListener("timeupdate", timeUpdate)
            window.removeEventListener("keydown", keyDown)
        }
    })

    useEffect(() => {
        if (!abSlider.current || !videoSliderRef.current) return
        if (abloop) {
            abSlider.current.slider.style.display = "flex"
            videoSliderRef.current.slider.style.marginTop = "10px"
        } else {
            abSlider.current.slider.style.display = "none"
            videoSliderRef.current.slider.style.marginTop = "0px"
        }
    }, [abloop])

    useEffect(() => {
        let id = 0
        if (!videoRef.current || !videoCanvasRef.current || !videoOverlayRef.current) return
        if (videoLoaded) {
            if (paused) {
                return videoRef.current.pause()
            } else {
                if (videoRef.current?.paused) {
                    setSeekTo(null)
                    videoRef.current.play()
                }
            }
            if (preservePitch) {
                videoRef.current.preservesPitch = true
            } else {
                videoRef.current.preservesPitch = false 
            }
            videoRef.current.playbackRate = speed 
            const videoCanvas = videoCanvasRef.current
            const sharpenOverlay = videoOverlayRef.current
            videoCanvas.style.opacity = "1"
            videoRef.current.style.opacity = "1"
            const landscape = videoRef.current.videoWidth >= videoRef.current.videoHeight
            const ratio = videoRef.current.videoWidth / videoRef.current.videoHeight
            const width = videoRef.current.clientWidth
            const height = videoRef.current.clientWidth / ratio
            videoCanvas.width = width
            videoCanvas.height = height
            sharpenOverlay.width = width
            sharpenOverlay.height = height
            const ctx = videoCanvas.getContext("2d") as any
            const sharpenCtx = sharpenOverlay.getContext("2d") as any
            let seekValue = seekTo !== null ? seekTo * speed : null 
            seekValue = dragging ? dragProgress * speed : seekValue
            if (seekValue !== null) if (Number.isNaN(seekValue) || !Number.isFinite(seekValue)) seekValue = 0
            if (seekValue !== null) videoRef.current.currentTime = seekValue
            setDuration(videoRef.current.duration / speed)
            let frame = videoRef.current as any

            const update = () => {
                if (!videoRef.current) return
                frame = videoRef.current
                let secondsProgress = videoRef.current.currentTime / speed
                if (reverse) secondsProgress = (videoRef.current.duration / speed) - secondsProgress
                //setSecondsProgress(secondsProgress)
                //setProgress((secondsProgress / duration) * 100)
            }

            const draw = () => {
                if (!videoRef.current || !videoCanvasRef.current) return
                const pixelWidth = videoCanvas.width / pixelate 
                const pixelHeight = videoCanvas.height / pixelate
                if (sharpen !== 0) {
                    const sharpenOpacity = sharpen / 5
                    sharpenOverlay.style.filter = `blur(4px) invert(1) contrast(75%)`
                    sharpenOverlay.style.mixBlendMode = "overlay"
                    sharpenOverlay.style.opacity = `${sharpenOpacity}`
                    sharpenCtx.clearRect(0, 0, sharpenOverlay.width, sharpenOverlay.height)
                    sharpenCtx.drawImage(frame, 0, 0, sharpenOverlay.width, sharpenOverlay.height)
                } else {
                    sharpenOverlay.style.filter = "none"
                    sharpenOverlay.style.mixBlendMode = "normal"
                    sharpenOverlay.style.opacity = "0"
                }
                if (pixelate !== 1) {
                    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height)
                    ctx.drawImage(frame, 0, 0, pixelWidth, pixelHeight)
                    if (landscape) {
                        videoCanvas.style.width = `${videoCanvas.width * pixelate}px`
                        videoCanvas.style.height = "auto"
                    } else {
                        videoCanvas.style.width = "auto"
                        videoCanvas.style.height = `${videoCanvas.height * pixelate}px`
                    }
                    videoCanvas.style.imageRendering = "pixelated"
                } else {
                    videoCanvas.style.width = `${videoCanvas.width}px`
                    videoCanvas.style.height = `${videoCanvas.height}px`
                    videoCanvas.style.imageRendering = "none"
                    ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height)
                    ctx.drawImage(frame, 0, 0, videoCanvas.width, videoCanvas.height)
                }
            }

            const videoLoop = async () => {
                draw()
                if (paused) {
                    // @ts-ignore
                    if (videoRef.current?.cancelVideoFrameCallback) {
                        // @ts-ignore
                        return videoRef.current?.cancelVideoFrameCallback(id)
                    } else {
                        return window.cancelAnimationFrame(id)
                    }
                }
                update()
                await new Promise<void>((resolve) => {
                    // @ts-ignore
                    if (videoRef.current?.requestVideoFrameCallback) {
                        // @ts-ignore
                        id = videoRef.current?.requestVideoFrameCallback(() => resolve())
                    } else {
                        id = window.requestAnimationFrame(() => resolve())
                    }
                }).then(videoLoop)
            }
            // @ts-ignore
            if (videoRef.current?.requestVideoFrameCallback) {
                // @ts-ignore
                id = videoRef.current?.requestVideoFrameCallback(videoLoop)
            } else {
                id = window.requestAnimationFrame(videoLoop)
            }
        } return () => {
            // @ts-ignore
            if (videoRef.current?.cancelVideoFrameCallback) {
                // @ts-ignore
                videoRef.current?.cancelVideoFrameCallback(id)
            } else {
                window.cancelAnimationFrame(id)
            }
        }
    }, [videoLoaded, reverse, seekTo, pixelate, paused, speed, preservePitch, dragging, dragProgress, sharpen])

    useEffect(() => {
        if (!videoFiltersRef.current) return
        const element = videoFiltersRef.current
        let newContrast = contrast
        const image = videoRef.current
        const sharpenOverlay = videoOverlayRef.current
        const lightnessOverlay = videoLightnessRef.current
        if (!image || !sharpenOverlay || !lightnessOverlay) return
        if (sharpen !== 0) {
            const sharpenOpacity = sharpen / 5
            newContrast += 25 * sharpenOpacity
            sharpenOverlay.style.backgroundImage = `url(${image.src})`
            sharpenOverlay.style.filter = `blur(4px) invert(1) contrast(75%)`
            sharpenOverlay.style.mixBlendMode = "overlay"
            sharpenOverlay.style.opacity = `${sharpenOpacity}`
        } else {
            sharpenOverlay.style.backgroundImage = "none"
            sharpenOverlay.style.filter = "none"
            sharpenOverlay.style.mixBlendMode = "normal"
            sharpenOverlay.style.opacity = "0"
        }
        if (lightness !== 100) {
            const filter = lightness < 100 ? "brightness(0)" : "brightness(0) invert(1)"
            lightnessOverlay.style.filter = filter
            lightnessOverlay.style.opacity = `${Math.abs((lightness - 100) / 100)}`
        } else {
            lightnessOverlay.style.filter = "none"
            lightnessOverlay.style.opacity = "0"
        }
        element.style.filter = `brightness(${brightness}%) contrast(${newContrast}%) hue-rotate(${hue - 180}deg) saturate(${saturation}%) blur(${blur}px)`
    }, [brightness, contrast, hue, saturation, lightness, blur, sharpen])

    const getVideoSpeedMarginRight = () => {
        const controlRect = videoControls.current?.getBoundingClientRect()
        const rect = videoSpeedRef.current?.getBoundingClientRect()
        if (!rect || !controlRect) return "400px"
        const raw = controlRect.right - rect.right
        let offset = -2
        return `${raw + offset}px`
    }

    const getVideoSubtitleMarginRight = () => {
        const controlRect = videoControls.current?.getBoundingClientRect()
        const rect = videoSubtitleRef.current?.getBoundingClientRect()
        if (!rect || !controlRect) return "400px"
        const raw = controlRect.right - rect.right
        let offset = -50
        return `${raw + offset}px`
    }

    const getVideoVolumeMarginRight = () => {
        const controlRect = videoControls.current?.getBoundingClientRect()
        const rect = videoVolumeRef.current?.getBoundingClientRect()
        if (!rect || !controlRect) return "400px"
        const raw = controlRect.right - rect.right
        let offset = -7
        return `${raw + offset}px`
    } 
    
    const getVideoFilterMarginRight = () => {
        const controlRect = videoControls.current?.getBoundingClientRect()
        const rect = videoFilterRef.current?.getBoundingClientRect()
        if (!rect || !controlRect) return "400px"
        const raw = controlRect.right - rect.right
        let offset = -135
        return `${raw + offset}px`
    }

    const updateProgressText = (value: number) => {
        let percent = value / 100
        const secondsProgress = percent * duration
        setDragProgress(secondsProgress)
    }

    const seek = (position: number) => {
        let secondsProgress = (position / 100) * duration
        setDragging(false)
        setSeekTo(secondsProgress)
        forceUpdate()
    }

    const changeReverse = (value?: boolean) => {
        const val = value !== undefined ? value : !reverse 
        let secondsProgress = val === true ? (duration / 100) * (100 - progress) : (duration / 100) * progress
        setReverse(val)
        if (val) {
            setSpeed(-Math.abs(speed))
        } else {
            setSpeed(Math.abs(speed))
        }
        setSeekTo(secondsProgress)
        forceUpdate()
    }

    const changePreservesPitch = (value?: boolean) => {
        const secondsProgress = (progress / 100) * duration
        setPreservePitch((prev) => value !== undefined ? value : !prev)
        setSeekTo(secondsProgress)
        forceUpdate()
    }

    const changeVolume = (value: number) => {
        if (!videoRef.current) return
        if (value < 0) value = 0
        if (value > 1) value = 1
        if (Number.isNaN(value)) value = 0
        if (value > 0) {
            videoRef.current.muted = false
        } else {
            videoRef.current.muted = true
        }
        videoRef.current.volume = functions.logSlider(value)
        setVolume(value)
        setPreviousVolume(value)
    }

    const mute = () => {
        if (!videoRef.current) return
        if (videoRef.current.volume > 0) {
            videoRef.current.muted = true
            videoRef.current.volume = 0
            setVolume(0)
        } else {
            const newVol = previousVolume ? previousVolume : 1
            videoRef.current.volume = functions.logSlider(newVol)
            videoRef.current.muted = false
            setVolume(newVol)
        }
        setShowVolumeSlider((prev) => !prev)
    }

    const rewind = (value?: number) => {
        if (!value) value = videoRef.current!.duration / 10
        let newTime = reverse ? videoRef.current!.currentTime + value : videoRef.current!.currentTime - value
        if (newTime < 0) newTime = 0
        if (newTime > videoRef.current!.duration) newTime = videoRef.current!.duration
        setSeekTo(newTime)
    }

    const fastforward = (value?: number) => {
        if (!value) value = videoRef.current!.duration / 10
        let newTime = reverse ? videoRef.current!.currentTime - value : videoRef.current!.currentTime + value
        if (newTime < 0) newTime = 0
        if (newTime > videoRef.current!.duration) newTime = videoRef.current!.duration
        setSeekTo(newTime)
    }

    const prevSub = () => {
        const cue = japaneseCues?.[subtitleIndexJA - 1]
        if (cue) {
            if (paused) setPaused(false)
            setSeekTo(cue.startTime - 0.05)
        }
    }

    const nextSub = () => {
        const cue = japaneseCues?.[subtitleIndexJA + 1]
        if (cue) {
            if (paused) setPaused(false)
            setSeekTo(cue.startTime - 0.05)
        }
    }

    useEffect(() => {
        if (jumpFlag) {
            const cue = japaneseCues?.[jumpFlag]
            if (cue) {
                if (paused) setPaused(false)
                setSeekTo(cue.startTime - 0.05)
            }
            setJumpFlag(null)
        }
    }, [jumpFlag])


    const onLoad = (event: any) => {
        if (paused) setPaused(false)
        if (videoRef.current) videoRef.current.style.display = "flex"
        setVideoLoaded(true)
        setTimeout(() => {
            seek(0)
        }, 70)
    }

    const controlMouseEnter = () => {
        setControlsVisible(true)
    }

    const controlMouseLeave = () => {
        setShowSpeedDropdown(false)
        setShowVolumeSlider(false)
        setControlsVisible(false)
    }

    useEffect(() => {
        if (controlsVisible) {
            if (videoControls.current) videoControls.current.style.opacity = "1"
            subtitleRef.current.style.bottom = "60px"
        } else {
            if (subtitleHover) return
            if (videoControls.current) videoControls.current.style.opacity = "0"
            subtitleRef.current.style.bottom = "0px"
        }
    }, [controlsVisible, subtitleHover])

    const reset = () => {
        changeReverse(false)
        setSpeed(1)
        setPaused(false)
        setShowSpeedDropdown(false)
        setPreservePitch(true)
        setABLoop(false)
        setLoopStart(0)
        setLoopEnd(100)
        setSeekTo(0)
        resetFilters()
    }

    const resetFilters = () => {
        setBrightness(100)
        setContrast(100)
        setHue(180)
        setSaturation(100)
        setLightness(100)
        setBlur(0)
        setSharpen(0)
        setPixelate(1)
        setInvert(false)
    }

    const fullscreen = async (exit?: boolean) => {
        // @ts-ignore
        if (document.fullscreenElement || document.webkitIsFullScreen || exit) {
            try {
                await document.exitFullscreen?.()
                // @ts-ignore
                await document.webkitExitFullscreen?.()
            } catch {
                // ignore
            }
            if (videoRef.current) {
                videoRef.current.style.maxWidth = "none"
                videoRef.current.style.maxHeight = "none"
                videoCanvasRef.current!.style.marginTop = "0px"
                videoCanvasRef.current!.style.marginBottom = "0px"
                videoFiltersRef.current!.style.marginBottom = "0px"
            }
            setTimeout(() => {
                resizeVideoCanvas()
            }, 100)
        } else {
            try {
                await fullscreenRef.current?.requestFullscreen?.()
                // @ts-ignore
                await fullscreenRef.current?.webkitRequestFullscreen?.()
            } catch {
                // ignore
            }
            if (videoRef.current) {
                videoRef.current.style.maxWidth = "100vw"
                videoRef.current.style.maxHeight = "100vh"
                videoCanvasRef.current!.style.marginTop = "auto"
                videoCanvasRef.current!.style.marginBottom = "auto"
                videoFiltersRef.current!.style.marginBottom = "40px"
            }
            setTimeout(() => {
                resizeVideoCanvas()
            }, 100)
        }
    }

    useEffect(() => {
        if (videoLoaded) {
            const japaneseTrack = (document.querySelector(".video") as HTMLVideoElement).textTracks[0]
            const englishTrack = (document.querySelector(".video") as HTMLVideoElement).textTracks[1]
            if (!japaneseTrack || !englishTrack) return
            japaneseTrack.mode = "hidden"
            englishTrack.mode = "hidden"
            const pollCues = async () => {
                await functions.timeout(500)
                const japaneseTrack = (document.querySelector(".video") as HTMLVideoElement)?.textTracks[0]
                const englishTrack = (document.querySelector(".video") as HTMLVideoElement)?.textTracks[1]
                if (!japaneseTrack?.cues?.length || !englishTrack?.cues?.length) {
                    return pollCues()
                } else {
                    setJapaneseCues(japaneseTrack.cues)
                    setEnglishCues(englishTrack.cues)
                }
            }
            pollCues()
        }
    }, [videoLoaded])

    useEffect(() => {
        if (japaneseCues) {
            const japaneseTrack = videoRef.current?.textTracks[0]
            if (!japaneseTrack) return
            japaneseTrack.mode = "hidden"
            for (let i = 0; i < japaneseCues?.length; i++) {
                const cue = japaneseCues[i]
                cue.onenter = () => {
                    // @ts-ignore
                    setSubtitleTextJA(functions.cleanSubs(cue.text))
                    setSubtitleIndexJA(i)
                }
                cue.onexit = () => {
                    setSubtitleTextJA("")
                }
            }
        }
    }, [japaneseCues])

    useEffect(() => {
        if (englishCues) {
            const englishTrack = videoRef.current?.textTracks[1]
            if (!englishTrack) return
            englishTrack.mode = "hidden"
            for (let i = 0; i < englishCues?.length; i++) {
                const cue = englishCues[i]
                cue.onenter = () => {
                    // @ts-ignore
                    setSubtitleTextEN(functions.cleanSubs(cue.text))
                    setSubtitleIndexEN(i)
                }
                cue.onexit = () => {
                    setSubtitleTextEN("")
                }
            }
        }
    }, [englishCues])

    const getFilter = (active?: boolean) => {
        if (typeof window === "undefined") return
        const bodyStyles = window.getComputedStyle(document.body)
        const color = active ? bodyStyles.getPropertyValue("--videoSliderActive") : bodyStyles.getPropertyValue("--videoSlider")
        return functions.calculateFilter(color)
    }

    const changeABLoop = (value: number[]) => {
        const loopStart = value[0]
        const loopEnd = value[1]
        const current = videoRef.current!.currentTime
        const start = reverse ? (videoRef.current!.duration / 100) * (100 - loopStart) : (videoRef.current!.duration / 100) * loopStart
        const end = reverse ? (videoRef.current!.duration / 100) * (100 - loopEnd) : (videoRef.current!.duration / 100) * loopEnd
        if (reverse) {
            if (current > start || current < end) {
                setSeekTo(end)
            }
        } else {
            if (current < start || current > end) {
                setSeekTo(start)
            }
        }
        setLoopStart(loopStart)
        setLoopEnd(loopEnd)
        setDragging(false)
    }

    const toggleAB = (value?: boolean) => {
        const val = value !== undefined ? value : !abloop
        if (val) {
            const startSec = videoRef.current!.currentTime
            let endSec = startSec + 5
            if (endSec > videoRef.current!.duration) endSec = videoRef.current!.duration
            const start = (startSec / videoRef.current!.duration) * 100
            const end = (endSec / videoRef.current!.duration) * 100
            setLoopStart(start)
            setLoopEnd(end)
        }
        setABLoop(val)
    }

    const updateProgressTextAB = (value: number[]) => {
        if (loopStart === value[0]) {
            let percent = value[1] / 100
            const progress = reverse ? duration - (1-percent) * duration : percent * duration
            setLoopStart(value[0])
            setLoopEnd(value[1])
            setDragProgress(progress)
        } else {
            let percent = value[0] / 100
            const progress = reverse ? duration - (1-percent) * duration : percent * duration
            setLoopStart(value[0])
            setLoopEnd(value[1])
            setDragProgress(progress)
        }
    }

    const getSubMinHeight = () => {
        if (showEnglishSubs && showJapaneseSubs) return "95px"
        if (showEnglishSubs || showJapaneseSubs) return "52px"
        return "0px"
    }

    useEffect(() => {
        if (typeof document === "undefined") return
        const element = document.querySelector(".video-slider-thumb") as HTMLElement
        if (element) element.style.filter = getFilter() || ""
    }, [siteColorChange])

    const filter = useMemo(() => {
        return getFilter()
    }, [siteColorChange])

    const filterActive = useMemo(() => {
        return getFilter(true)
    }, [siteColorChange])

    return (
        <div className="video-player" onMouseEnter={() => setEnableDrag(false)} ref={fullscreenRef}>
            <div className="video-player-video-container" style={{filter: invert ? "invert(1)" : ""}}>
                <div className="video-subtitles" style={{minHeight: getSubMinHeight()}} ref={subtitleRef} 
                onMouseEnter={() => setSubtitleHover(true)} onMouseLeave={() => setSubtitleHover(false)}>
                    {showJapaneseSubs ? 
                    <div className="video-subtitles-row" onMouseEnter={() => setEnableDrag(false)}>
                        <span className="video-subtitles-text">{subtitleTextJA}</span>
                    </div> : null}
                    {showEnglishSubs ? 
                    <div className="video-subtitles-row" onMouseEnter={() => setEnableDrag(false)}>
                        <span className="video-subtitles-text">{subtitleTextEN}</span>
                    </div> : null}
                </div>
                <div className="video-filters" ref={videoFiltersRef} onClick={() => setPaused((prev) => !prev)}>
                    <img className="video-lightness-overlay" ref={videoLightnessRef} src={backFrame}/>
                    <canvas className="video-sharpen-overlay" ref={videoOverlayRef}></canvas>
                    <canvas className="video-canvas" ref={videoCanvasRef}></canvas>
                    <video crossOrigin="anonymous" autoPlay disablePictureInPicture playsInline className="video" ref={videoRef} 
                        src={video} onLoadedData={(event) => onLoad(event)}>
                        <track kind="subtitles" src={japaneseSubs} srcLang="ja" style={{opacity: 0}}/>
                        <track kind="subtitles" src={englishSubs} srcLang="en" style={{opacity: 0}}/>
                    </video>
                </div>
            </div>
            <div className="video-controls" ref={videoControls} onMouseUp={() => setDragging(false)} onMouseOver={controlMouseEnter} onMouseLeave={controlMouseLeave}>
                <div className="video-control-row" onMouseEnter={() => setEnableDrag(false)} onMouseLeave={() => setEnableDrag(true)}>
                    <p className="video-control-text">{dragging ? functions.formatSeconds(dragProgress) : functions.formatSeconds(secondsProgress)}</p>
                    <div className="video-control-slider-container">
                        <Slider ref={videoSliderRef} className="video-slider" trackClassName="video-slider-track" 
                        thumbClassName="video-slider-thumb" min={0} max={100} step={0.01} value={progress} onBeforeChange={() => setDragging(true)} 
                        onChange={(value) => updateProgressText(value)} onAfterChange={(value) => seek(reverse ? 100 - value : value)}/>
                        <Slider ref={abSlider} className="video-ab-slider" trackClassName="video-ab-slider-track" 
                        thumbClassName="video-ab-slider-thumb" min={0} max={100} step={0.01} value={[loopStart, loopEnd]} onBeforeChange={() => setDragging(true)} 
                        onChange={(value) => updateProgressTextAB(value)} onAfterChange={(value) => changeABLoop(value)}/>
                    </div>
                    <p className="video-control-text">{functions.formatSeconds(duration)}</p>
                </div>
                <div className="video-control-row" onMouseEnter={() => setEnableDrag(false)} onMouseLeave={() => setEnableDrag(true)}>
                    <div className="video-control-row-container">
                        <FXIcon className="video-control-img" ref={videoFilterRef} onClick={() => setShowFilterDropdown((prev) => !prev)}/>
                        <SpeedIcon className="video-control-img" ref={videoSpeedRef} onClick={() => setShowSpeedDropdown((prev) => !prev)}/>
                        <PreservePitchIcon className="video-control-img" onClick={() => changePreservesPitch()}/>
                        <ClearIcon className="video-control-img" onClick={reset}/>
                    </div> 
                    <div className="video-ontrol-row-container">
                        <RewindIcon className="video-control-img" onClick={() => prevSub()}/>
                        {paused ? 
                        <PlayIcon className="video-control-img" onClick={() => setPaused((prev) => !prev)}/> :
                        <PauseIcon className="video-control-img" onClick={() => setPaused((prev) => !prev)}/>}
                        <FastforwardIcon className="video-control-img" onClick={() => nextSub()}/>
                    </div> 
                    <div className="video-control-row-container">
                        <ABLoopIcon className="video-control-img" onClick={() => toggleAB()}/>
                    </div>
                    <div className="video-control-row-container" onClick={() => setShowSubtitleDropdown((prev) => !prev)}>
                        <SubIcon className="video-control-img" ref={videoSubtitleRef}/>
                    </div> 
                    <div className="video-control-row-container">
                        <FullscreenIcon className="video-control-img" onClick={() => fullscreen()}/>
                    </div> 
                    <div className="video-control-row-container" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        {volume <= 0.01 ?
                        <VolumeMuteIcon className="video-control-img" ref={videoVolumeRef} onClick={mute}/> : 
                        volume <= 0.5 ?
                        <VolumeLowIcon className="video-control-img" ref={videoVolumeRef} onClick={mute}/> : 
                        <VolumeIcon className="video-control-img" ref={videoVolumeRef} onClick={mute}/>}
                    </div> 
                </div>
                <div className={`video-speed-dropdown ${showSpeedDropdown ? "" : "hide-speed-dropdown"}`} style={{marginRight: getVideoSpeedMarginRight(), marginTop: "-240px"}}
                onMouseEnter={() => setEnableDrag(false)} onMouseLeave={() => setEnableDrag(true)}>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(4); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">4x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(2); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">2x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(1.75); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">1.75x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(1.5); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">1.5x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(1.25); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">1.25x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(1); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">1x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(0.75); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">0.75x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(0.5); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">0.5x</span>
                    </div>
                    <div className="video-speed-dropdown-item" onClick={() => {setSpeed(0.25); setShowSpeedDropdown(false)}}>
                        <span className="video-speed-dropdown-text">0.25x</span>
                    </div>
                </div>
                <div className={`video-subtitle-dropdown ${showSubtitleDropdown ? "" : "hide-subtitle-dropdown"}`} style={{marginRight: getVideoSubtitleMarginRight(), marginTop: "-75px"}}
                onMouseEnter={() => {setEnableDrag(false)}} onMouseLeave={() => {setShowSubtitleDropdown(false); setEnableDrag(true)}}>
                    <div className="video-subtitle-dropdown-container">
                        <div className="video-subtitle-dropdown-row" onClick={() => setShowJapaneseSubs((prev) => !prev)}>
                            {showJapaneseSubs ? 
                            <CheckboxCheckedIcon className="video-subtitle-dropdown-checkbox"/> : 
                            <CheckboxIcon className="video-subtitle-dropdown-checkbox"/>}
                            <span className="video-subtitle-dropdown-text">Japanese</span>
                        </div>
                        <div className="video-subtitle-dropdown-row" onClick={() => setShowEnglishSubs((prev) => !prev)}>
                            {showEnglishSubs ? 
                            <CheckboxCheckedIcon className="video-subtitle-dropdown-checkbox"/> : 
                            <CheckboxIcon className="video-subtitle-dropdown-checkbox"/>}
                            <span className="video-subtitle-dropdown-text">English</span>
                        </div>
                    </div>
                </div>
                <div className={`video-volume-dropdown ${showVolumeSlider ? "" : "hide-volume-dropdown"}`} style={{marginRight: getVideoVolumeMarginRight(), marginTop: "-110px"}}
                onMouseEnter={() => {setShowVolumeSlider(true); setEnableDrag(false)}} onMouseLeave={() => {setShowVolumeSlider(false); setEnableDrag(true)}}>
                    <Slider ref={videoVolumeSliderRef} invert orientation="vertical" className="volume-slider" trackClassName="volume-slider-track" thumbClassName="volume-slider-thumb"
                    value={volume} min={0} max={1} step={0.01} onChange={(value) => changeVolume(value)}/>
                </div>
                <div className={`video-filter-dropdown ${showFilterDropdown ? "" : "hide-filter-dropdown"}`} style={{marginRight: getVideoFilterMarginRight(), top: "-300px"}}
                onMouseEnter={() => {setShowFilterDropdown(true); setEnableDrag(false)}} onMouseLeave={() => {setShowFilterDropdown(false); setEnableDrag(true)}}>
                    <div className="video-filter-dropdown-container">
                        <div className="video-filter-dropdown-row">
                            <BrightnessIcon className="video-filter-dropdown-img"/>
                            <span className="video-filter-dropdown-text">Brightness</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setBrightness(value)} min={60} max={140} step={1} value={brightness}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <ContrastIcon className="video-filter-dropdown-img" style={{marginLeft: "7px", marginRight: "-7px"}}/>
                            <span className="video-filter-dropdown-text">Contrast</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setContrast(value)} min={60} max={140} step={1} value={contrast}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <HueIcon className="video-filter-dropdown-img" style={{marginLeft: "20px", marginRight: "-20px"}}/>
                            <span className="video-filter-dropdown-text">Hue</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setHue(value)} min={150} max={210} step={1} value={hue}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <SaturationIcon className="video-filter-dropdown-img"/>
                            <span className="video-filter-dropdown-text">Saturation</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setSaturation(value)} min={60} max={140} step={1} value={saturation}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <LightnessIcon className="video-filter-dropdown-img"/>
                            <span className="video-filter-dropdown-text">Lightness</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setLightness(value)} min={60} max={140} step={1} value={lightness}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <BlurIcon className="video-filter-dropdown-img" style={{marginLeft: "20px", marginRight: "-20px"}}/>
                            <span className="video-filter-dropdown-text">Blur</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setBlur(value)} min={0} max={2} step={0.1} value={blur}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <SharpenIcon className="video-filter-dropdown-img" style={{marginLeft: "8px", marginRight: "-8px"}}/>
                            <span className="video-filter-dropdown-text">Sharpen</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setSharpen(value)} min={0} max={5} step={0.1} value={sharpen}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <PixelateIcon className="video-filter-dropdown-img"/>
                            <span className="video-filter-dropdown-text">Pixelate</span>
                            <Slider className="video-filter-slider" trackClassName="video-filter-slider-track" thumbClassName="video-filter-slider-thumb" onChange={(value) => setPixelate(value)} min={1} max={10} step={0.1} value={pixelate}/>
                        </div>
                        <div className="video-filter-dropdown-row">
                            <button className="video-filter-dropdown-button" onClick={() => setInvert(!invert)} style={{marginRight: "30px"}}>Invert</button>
                            <button className="video-filter-dropdown-button" onClick={() => resetFilters()}>Reset</button>
                        </div>
                    </div>
                </div>
            </div>
            <div/>
        </div>
    )
}

export default VideoPlayer