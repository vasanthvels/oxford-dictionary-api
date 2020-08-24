/*Oxford Dictionary API - created by www.hybridappzone.com*/

const express = require("express");
const axios = require("axios");
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded())

const instance = axios.create({
  baseURL: 'https://od-api.oxforddictionaries.com',
  headers: {
    'Accept': 'application/json',
    'app_id': process.env.APPID,
    'app_key': process.env.APPKEY
  }
});

app.get('/', function (req, res) {
  res.sendFile('views/index.html', { root: __dirname });
});

app.post('/search', (req, res) => {
  const input = req.body.oxford;
  try {
    instance.get(`/api/v2/entries/en-us/${input}`)
      .then(result => {
        const data = {
          "definition": result.data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0],
          "phrases": result.data.results[0].lexicalEntries[0].phrases[0].text
        }
        res.status(200).send(data)
      })
      .catch(err => res.send(err));
  }
  catch (err) {
    console.error(err);
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
