const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const configRoutes = require("./routes");


app.use(bodyParser.json(), function (req, res, next) {
    next();
});;

app.use(function (req, res, next) {
    console.log('Req Body:', req.body);
    console.log('URL Requested:', req.originalUrl);
    console.log('Request Verb:', req.method);
    next();
});

let UrlCount = [];

app.use(function (req, res, next) {
    if (UrlCount[req.originalUrl]!=undefined) {
        UrlCount[req.originalUrl] = UrlCount[req.originalUrl] + 1;
        console.log("This URL has been accessed", UrlCount[req.originalUrl], "times! \n");
    }
    else {
        UrlCount[req.originalUrl] = 1;
        console.log("This URL has been accessed for the first time. \n");
    }
    next();
});

configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000 \n");
});