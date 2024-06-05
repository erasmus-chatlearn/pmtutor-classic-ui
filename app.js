const express = require('express');
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;
require('dotenv').config();

let REDIRECT_URI = process.env.BASE_URL + ":" + process.env.PORT + "/appid/callback";

if ( process.env.CE_APP && process.env.CE_SUBDOMAIN && process.env.CE_DOMAIN ) {
    REDIRECT_URI = 'https://' + process.env.CE_APP + '.' + process.env.CE_SUBDOMAIN + '.' + process.env.CE_DOMAIN + '/appid/callback';
}

const app = express();
app.use(session({
    secret: '123456',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({
    tenantId: process.env.IBM_APP_ID_TENANT_ID,
    clientId: process.env.IBM_APP_ID_CLIENT_ID,
    secret: process.env.IBM_APP_ID_SECRET,
    oauthServerUrl: process.env.IBM_OAUTH_SERVER_URL,
    redirectUri: REDIRECT_URI
}));

app.get('/appid/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {keepSessionInfo: true}));

app.get('/appid/logout', function(req, res){
    // solution from https://github.com/ibm-cloud-security/appid-serversdk-nodejs/issues/190
    req._sessionManager = false;
    WebAppStrategy.logout(req);
    res.clearCookie('refreshToken');
    res.redirect('/');
});

app.get('/user', (req, res) => {
    if (req.user) {
        res.json(req.user);
    } else {
        res.status(401).send("Unauthorized");
    }
});

// Protect the entire application
app.use(passport.authenticate(WebAppStrategy.STRATEGY_NAME, {keepSessionInfo: true}));

app.use(express.static('./public'));

app.listen(process.env.PORT, () => {
    console.log('Listening on ' + process.env.BASE_URL + ":" + process.env.PORT);
});
