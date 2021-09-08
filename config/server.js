const app = require("express")();
const bodyParser = require("body-parser");
const logger = require("morgan");
const port = process.env.PORT || 3030;

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("*", (req, res) => {
  res.send("Welcome to Mamlaka Farm");
});
app.listen(port, () => {
  console.log(`Server running on port ${port}, awesome `);
});
