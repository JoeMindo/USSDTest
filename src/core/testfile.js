import express from 'express';
import bodyParser from 'body-parser';
const app = express()
const port = 3030

app.use(bodyParser.json());
app.post('/users', (req, res) => {
    let user = req.body;
    console.log(user);
    res.send("User added!");
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})