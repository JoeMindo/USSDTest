import dotenv from 'dotenv'
import express from 'express'
import bodyParser from "body-parser"
import logger from "morgan"
// import axios from 'axios'
dotenv.config()
const port = process.env.PORT || 3030;


let app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ussd", (req, res) => {
  let { sessionId, serviceCode, phoneNumber, text } = req.body;
  res.send(`Welcome to Mamlaka Farm`);
});
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}, `);
});

export { server, app }
