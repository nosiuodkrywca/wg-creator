const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 5000

const request = require('request').defaults({jar: true})

app.use(bodyParser.json())

const cookieJar = request.jar();
app.use(bodyParser.urlencoded({ extended: false }))

require('dotenv').config()

const wg_url = process.env.WG_URL;
const wg_password = process.env.WG_PASSWORD;
const secret = process.env.SECRET;

app.use('/*', (req, res) => {

    data = req.body || null;

    if(data.secret != secret) {
        res.status(403).json({error: 403, status: "unauthorized"});
        return;
    }

    request.post({
        rejectUnauthorized: false,
        url:     wg_url+'/session',
        json:    { "password": wg_password }
      }, function(error, response, body){

        request[req.method.toLowerCase()]({
            rejectUnauthorized: false,
            url:        wg_url+req.originalUrl,
            json:       data
        }, function(error, response, body){
            res.json(body)
        });
      }
    );

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})