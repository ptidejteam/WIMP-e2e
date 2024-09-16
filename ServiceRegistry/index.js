const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = process.env.PORT || 3006;

const rateLimit = 20;
const interval = 60000;

//app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(morgan('combined'));
app.disable('x-powered-by');

services = [
    {
        route: '/login',
        target: 'http://localhost:3001/login'
    },
    {
        route: '/users',
        target: 'http://localhost:3001/users'
    },
    {
        route: '/payload',
        target: 'http://localhost:3002/payload'
    },
    {
        route: '/gethistory',
        target: 'http://localhost:3002/gethistory'
    },
    {
        route: '/getspecifichistory',
        target: 'http://localhost:3002/getspecifichistory'
    },
    {
        route: '/execpayload',
        target: 'http://localhost:3002/execpayload'
    },
    {
        route: '/savepayload',
        target: 'http://localhost:3002/savepayload'
    },
    {
        route: '/establishsender',
        target: 'http://localhost:3002/establishsender'
    },
    {
        route: '/modifystatus',
        target: 'http://localhost:3002/modifystatus'
    },
    {
        route: '/flushhistory',
        target: 'http://localhost:3002/flushhistory'
    },
    {
        route: '/deletesomehistory',
        target: 'http://localhost:3002/deletesomehistory'
    },
    {
        route: '/testresults',
        target: 'http://localhost:3003/testresults'
    },
    {
        route: '/gettestresults',
        target: 'http://localhost:3003/gettestresults'
    },
    {
        route: '/sendjsonhttp',
        target: 'http://localhost:3003/sendjsonhttp'
    },
    {
        route: '/establishreceiver',
        target: 'http://localhost:3003/establishreceiver'
    },
    {
        route: '/updatemethod',
        target: 'http://localhost:3003/updatemethod'
    },
    {
        route: '/fetchtestresults',
        target: 'http://localhost:3003/fetchtestresults'
    },
    {
        route: '/flushresultlog',
        target: 'http://localhost:3003/flushresultlog'
    },
    {
        route: '/deletesomeresults',
        target: 'http://localhost:3003/deletesomeresults'
    },
    {
        route: '/getavailabletcids',
        target: 'http://localhost:3003/getavailabletcids'
    }
];

const requestList = {};

setInterval(() =>{
    Object.keys(requestList).forEach((ip) => {
        requestList[ip] = 0;
    });
}, interval);

//Setup rate limit and timeout.
function rateLimitAndTimeout(req, res, next){
    const ip = req.ip;

    requestList[ip] = (requestList[ip] || 0) + 1;

    //Check if list excess limit.
    if(requestList[ip] > rateLimit){
        //429 = trop de requetes.
        return res.status(429).json({
            code: 429,
            status: 'Error',
            message:'Trop de requêtes envoyés',
            data: null
        });
    }

    //Mise en place du timeout pour une requete.
    req.setTimeout(15000, () =>{
        res.status(504).json({
            code: 504,
            status: 'Error',
            message: 'Timeout avec le gateway.',
            data: null
        });
        req.abort();
    });

    next();
}

app.use(rateLimitAndTimeout);

//Mise en place du middleware proxy.
services.forEach(({route, target}) =>{

    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
           [`^${route}`]: ""
        },
    };
    //Appliquer toutes les limites créés.
    app.use(route, rateLimitAndTimeout, createProxyMiddleware(proxyOptions));
});

app.use((req, res) =>{
    res.status(404).json({
        code: 404,
        status: 'Error',
        message: 'Route not found',
        data: null
    });
});

app.listen(port, () => console.log("Service registry is listening on port " + port));

