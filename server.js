const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const csvtojson = require('csvtojson');

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.post('/save', urlencodedParser, (req, res) => {
    function addZero(i) {
        if (i < 10) { i = "0" + i }
        return i;
    }
    const d = new Date();
    date = `${addZero(d.getDate())}/${addZero(d.getMonth() + 1)}/${addZero(d.getFullYear())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}`
    let str = `"${req.body.name}", "${req.body.score}", "${date}"\n`;
    fs.appendFile(path.join(__dirname, 'data/data.csv'), str, function (err) {
        if (err) return res.status(400).json({
            success: false,
            message: 'An error occurred while trying to save the file.'
        });
    });
    res.redirect(301, '/');
});

app.get('/scoreboard', (req, res) => {
    csvtojson({ headers: ['name', 'score', 'date'] }).fromFile(path.join(__dirname, ('data/data.csv'))).then(data => {
        res.render('index', { data: data });
    }).catch(err => {
        console.log(err);
    });
});
