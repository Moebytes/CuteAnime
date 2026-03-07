import path from "path"
import cors from "cors"
import mime from "mime"
import {Readable} from "stream"
import fs from "fs"
import express from "express"
import dotenv from "dotenv"
import {createRsbuild} from "@rsbuild/core"
import rsbuildConfig from "./rsbuild.config.ts"
import dbFunctions from "./structures/DatabaseFunctions.ts"
const __dirname = path.resolve()

dotenv.config()
const app = express()
app.use(express.urlencoded({extended: true, limit: "1gb", parameterLimit: 50000}))
app.use(express.json({limit: "1gb"}))
app.use(cors({credentials: true, origin: true}))
app.disable("x-powered-by")
app.set("trust proxy", true)

app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./dist"), {index: false}))
app.use("/assets", express.static(path.join(__dirname, "./assets")))

app.get("/Anime/{*page}", function(req, res, next) {
  if (req.path.includes("/anime")) return next()
  res.setHeader("Content-Type", mime.getType(req.path) ?? "")
  res.header("Access-Control-Allow-Origin", "*")
  try {
    let pathname = `/Volumes/Files/${decodeURIComponent(req.path.slice(1)).replaceAll(":", "%3A")}`
    const body = fs.readFileSync(pathname)
    const contentLength = body.length
    if (req.headers.range) {
      const parts = req.headers.range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0])
      const end = parts[1] ? parseInt(parts[1]) : contentLength - 1
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${contentLength}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1
      })
      const stream = Readable.from(body.slice(start, end + 1))
      return stream.pipe(res)
    }
    res.setHeader("Content-Length", contentLength)
    res.status(200).end(body)
  } catch (e) {
    console.log(e)
    res.status(400).end()
  }
})

app.get("/{*page}", async function(req, res) {
    res.setHeader("Content-Type", mime.getType(req.path) ?? "")
    res.header("Access-Control-Allow-Origin", "*")
    const document = fs.readFileSync(path.join(__dirname, "./dist/index.html"), {encoding: "utf-8"})
    res.status(200).send(document)
})

const run = async () => {
  dbFunctions.logGenres()
  let port = process.env.PORT || 8081

  if (process.env.TESTING === "yes") {
    const rsbuild = await createRsbuild({rsbuildConfig})
    const rsbuildServer = await rsbuild.createDevServer()
    app.use(rsbuildServer.middlewares)

    app.listen(port, async () => {
      console.log(`Started the dev server! http://localhost:${port}`)
      await rsbuildServer.afterListen()
    })
  } else {
    app.listen(port, () => {
      console.log(`Started the web server! http://localhost:${port}`)
    })
  }
}

run()