const express = require('express')
const path = require('path')
const app = express()

const winston = require('winston')




var globals = {
    config: {
        logFile: path.join(__dirname, "..", "logs", "channels.log"),
        staticPath: path.join(__dirname, "..", "static"),
        port: 6210
    }
}

globals.logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: globals.config.logFile }),
    ],
})

function logInfo(message) {
    let entry = { time: new Date().toISOString(), message: message }
    globals.logger.info(entry)
}

function logError(message) {
    let time = new Date().toISOString()
    if (typeof message === "string") {
        let entry = { time: time, message: message }
        globals.logger.error(entry)
    } else {
        message.time = time
        globals.logger.error(message)
    }
}

function logException(ex, info) {
    try {
        let item = {
            message: ex.message,
            stack: ex.stack
        }
        if (info) {
            item.info = info
        }
        logError(item)
    } catch (ex) {
    }
}


app.use(express.json())

app.use('/enne/static', express.static(globals.config.staticPath))


let editorPage
let env = process.argv[2]
if (env === "debug") {
    logInfo("Using debug page")
    globals.config.host = "http://localhost:" + globals.config.port
    editorPage = path.join(globals.config.staticPath, "editor_debug.html")
} else {
    logInfo("Using prod page")
    globals.config.host = "https://drakon.tech"
    editorPage = path.join(globals.config.staticPath, "editor_prod.html")
}


app.use('/channels/doc/:docId', express.static(editorPage))
app.use('/channels', express.static(editorPage))

app.listen(globals.config.port, () => {
    logInfo(`enne server listening at port ${globals.config.port}`)
})