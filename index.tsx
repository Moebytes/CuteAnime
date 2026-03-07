/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Cuteanime - Learn japanese by watching anime ❤            *
 * Copyright © 2026 Moebytes <moebytes.com>                  *
 * Licensed under CC BY-NC 4.0. See license.txt for details. *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import React from "react"
import {createRoot} from "react-dom/client"
import {BrowserRouter as Router} from "react-router-dom"
import {Provider} from "react-redux"
import store from "./store"
import App from "./App"

const root = createRoot(document.getElementById("root")!)
root.render(<Router><Provider store={store} stabilityCheck="never"><App/></Provider></Router>)