import http from "http";
//import https from "https";
// import socketio from "socket.io";
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import morgan from "morgan";
import setRoutes from "./routes";
// import setGraphql from "./graphql";
import helmetEncapsulation from "./helmet";
import handleSocketConnection from "./socket";
import socket_middleware from "../src/middleware/socket/socket_middleware";
import app_auth from "../src/middleware/auth/app_auth";
// import { createAdapter } from "@socket.io/redis-adapter";
// import config from "config";
const socketio = require("socket.io")
const server = express();
const accessLogStream = fs.createWriteStream(
  path.normalize(__dirname + "/../logs/access.log"),
  {
    flags: "a",
  }
);

// server.use((req, res, next) => {
//     const message = 'new incomming request'
//     UDP_CONNECTION.send(message, 0, message.length, config.get('s_port'), config.get('s_ip'))
//     next();
// });

server.use(morgan("dev", { stream: accessLogStream }));
server.use(
  morgan(function(tokens, req, res) {
    const status = tokens.status(req, res);
    const message = [
      tokens.method(req, res),
      tokens.url(req, res),
      status,
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
    // UDP_CONNECTION.send(message, 0, message.length, config.get('s_port'), config.get('s_ip'));
    if (Number(status) < 400 || Number(status) > 500) return;
    return message;
  })
);
helmetEncapsulation(server);
server.use(morgan("dev"));

// TODO use server when the issue on hosted url solved
server.use(
  cors({
    // origin: [
    //   "http://localhost:5000",
    // ],
    credentials: true,
    origin: "*",
  })
);
server.use(app_auth());
server.use(express.json({ limit: "100kb" }));
server.use("/api/photo", express.static("storage/images"));
server.use("/api/signature", express.static("storage/signature"));
setRoutes(server);
// setGraphql(server);

server.use((err, req, res, next) => {
  res.send(err.message);
});

const app = http.createServer(
  // {
  //   key: fs.readFileSync(path.normalize(__dirname + "/../keys/server-key.pem")),
  //   cert: fs.readFileSync(
  //     path.normalize(__dirname + "/../keys/server-cert.pem")
  //   ),
  // },
  server
);

const io = socketio(app, {
  cors: {
    origin: [
      "http://localhost:5000",
      "http://localhost:8000",
      "http://localhost:3000",
      "http://localhost",
      "http://10.3.0.127:8080",
      "http://10.42.0.163:5000",
      "http://192.168.43.65:5000",
      "http://192.168.43.65:3000",
      "http://192.168.137.61:8000",
      "http://192.168.137.61",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["token"],
    credentials: true,
    allowEIO3: true,
  },
});
// global.REDIS_SERVICE ? io.adapter(createAdapter(REDIS_SERVICE.client, REDIS_SERVICE.subscriber,{})) : '';
io.use(socket_middleware);
io.on("connect", handleSocketConnection);

export { app, io };
