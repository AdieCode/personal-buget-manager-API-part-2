const express = require('express');
const router = express.Router();
const { data } = require('../data/data.js')
const OAuth2Server = require('oauth2-server');

const app = express();

// Create Oauth instance here
const oauth = new OAuth2Server({
  model: require('./model.js'),
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: 60 * 60
})

module.exports = router;