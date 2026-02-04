import express from 'express';
import {matchRouter} from "./routes/matches.js";
import * as http from "node:http";
import {attachWebSocketServer} from "./ws/server.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/matches', matchRouter);
// Initializes & readies the broadcastMatchCreated function at the same time
const { broadcastMatchCreated } = attachWebSocketServer(server);
// app locals is Express version of a global object so elevating it to a global function
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  // check if host is local, if so use normal localhost:XXXX style or else display the real http route and port
  const baseURL = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server is running on ${baseURL}`);
  console.log(`WebSocket Server is running on ${baseURL.replace('http', 'ws')}/ws`);
})