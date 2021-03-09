import app from "../app";
import Debug from "debug";
import http from "http";
const debug = Debug("demo:server");

let port: number = parseInt(process.env.PORT || "3000");
let server: http.Server = http.createServer(app.callback());

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }
  let bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {
  let addr = server.address();
  if (addr) {
    let bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    debug("Listening on " + bind);
  }
}
