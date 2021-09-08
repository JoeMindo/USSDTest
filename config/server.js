const app = require("express")();
const bodyParser = require("body-parser");
const logger = require("morgan");
const port = process.env.PORT || 3030;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ussd", (req, res) => {
  res.send("Welcome to Mamlaka Farm");
});
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
module.exports = server