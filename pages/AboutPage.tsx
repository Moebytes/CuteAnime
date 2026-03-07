/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React, {useEffect, useReducer} from "react"
import {useLayoutActions} from "../store"
import TitleBar from "../components/TitleBar"
import Footer from "../components/Footer"
import playerImg from "../assets/images/player.png"
import "./styles/aboutpage.less"

const AboutPage: React.FunctionComponent = (props) => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
    const {setEnableDrag} = useLayoutActions()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        document.title = "About"
    })
    
    return (
        <>
        <TitleBar rerender={forceUpdate}/>
        <div className="body">
            <div className="content" onMouseEnter={() => setEnableDrag(true)}>
                <div className="about">
                    <div className="about-row">
                        <span className="about-title">About</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                                CuteAnime is a website where you can watch anime with Japanese subtitles. It is a fun way to 
                                study Japanese with dictionary extensions such as 
                                <span className="about-link" onClick={() => window.open("https://yomitan.wiki/", "_blank")}> Yomitan.</span><br/><br/>

                                The anime subtitles are mostly retrieved from <span className="about-link" onClick={() => window.open("https://www.kitsunekko.net/dirlist.php?dir=subtitles%2Fjapanese%2F", "_blank")}>Kitsunekko</span>. 
                        </span>
                    </div>
                    <div className="about-row">
                        <img className="about-img" src={playerImg}/>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Study Guide</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            You should be using <span className="about-link" onClick={() => window.open("https://apps.ankiweb.net", "_blank")}>Anki </span> 
                            with the <span className="about-link" onClick={() => window.open("https://ankiweb.net/shared/info/2055492159", "_blank")}>AnkiConnect </span>
                            extension and creating decks for every couple of minutes that you watch. <br/><br/>

                            When you are watching add words that you do not know to the Anki deck for that episode. 
                            Your decks should look something like Anime::Episode 1::5:00.<br/><br/>

                            To have an easier time recalling words, you should write them down. If you are having trouble with a 
                            Kanji’s stroke order, you can look it up on <span className="about-link" onClick={() => window.open("https://jisho.org", "_blank")}>Jisho</span>. <br/><br/>

                            Learning Japanese is very hard at first, but it should become easier as you increase your vocabulary. Good luck!<br/><br/>
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Switching Subtitles</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            You can toggle Japanese and/or English subtitles on and off with the "Sub" option in the video player. Since the Japanese and 
                            English subtitles are from different sources there might be a different amount of dialogue for each. The site functions 
                            (jumping to next/previous dialoges, subtitle catalog) are timed on the Japanese subtitles. <br/><br/>
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Subtitle Catalog</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text"> 
                            The subtitle catalog contains a list of all the subtitles in the episode and you can quickly jump to a specific dialogue by 
                            clicking on the play marker before each subtitle. Another benefit of the subtitle catalog is that you also search through 
                            the entire script of an episode by using your browser's search function.<br/><br/>
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Jumping to Next/Previous Dialogue</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text"> 
                            You jump to the next/previous dialogues by clicking on the arrow buttons on the side of the play button. <br/><br/>

                            You can also use the left/right arrow keys on your keyboard. This is the list of all keyboard shortcuts available:<br/>
                            Space - Play/Pause <br/>
                            Left Arrow - Previous Dialogue <br/>
                            Right Arrow - Next Dialogue <br/>
                            Up Arrow - Increase Volume <br/>
                            Down Arrow - Decrease Volume <br/><br/>
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Official Website</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            There is a link to the official website where you will probably find links to buy the anime and/or manga. <br/><br/>
                        </span>
                    </div>
                    <div className="about-row">
                        <span className="about-title">Contact</span>
                    </div>
                    <div className="about-row">
                        <span className="about-text">
                            If you need to contact us for any reason send us an email at 
                            <span className="about-link" onClick={() => window.open("mailto:cutemanga.moe@gmail.com")}> cutemanga.moe@gmail.com</span>.  <br/><br/>

                            I hope that you enjoy studying Japanese!
                        </span>
                    </div>
                </div>
                <Footer/>
            </div>
        </div>
        </>
    )
}

export default AboutPage