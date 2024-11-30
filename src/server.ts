import app from "./app";

var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

const PORT = process.env.PORT || 3000;

app.use(connectLiveReload());

app.listen(PORT, () => {
    console.log(`Server started at http://0.0.0.0:${PORT}`);
});
