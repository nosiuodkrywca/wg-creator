const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const cors = require('cors')

const corsOpts = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOpts))

const request = require('request').defaults({jar: true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('dotenv').config()

const port = process.env.PORT;
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
  console.log(`listening on port ${port}`)
})