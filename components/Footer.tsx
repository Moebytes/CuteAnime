/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {useNavigate} from "react-router-dom"
import "./styles/footer.less"

const Footer: React.FunctionComponent = () => {
    const navigate = useNavigate()

    return (
        <div className="footer">
            <div className="footer-row">
                <div className="footer-links-container">
                    <div className="footer-link-box" onClick={() => navigate(`/`)}>
                        <span className="footer-link-text-big">CuteAnime</span>
                    </div>
                </div>
                <span className="footer-link-text-small">©{new Date().getFullYear()} CuteAnime</span>
            </div>
        </div>
    )
}

export default Footer