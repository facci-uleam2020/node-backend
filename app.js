const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(morgan('dev'));

const { API_VERSION } = require('./config');

// load routing
const authRoutes = require('./routers/auth');
const userRoutes = require('./routers/user');
const cursoRoutes = require('./routers/curso');
const seccionRoutes = require('./routers/seccion');
const comprasRoutes = require('./routers/compras');
const carritoRoutes = require('./routers/carrito');
const examRoutes = require('./routers/exam');
const answersRoutes = require('./routers/answers');
const resultsRoutes = require('./routers/results');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Header HTTP
app.use(cors());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// router basic
app.use(`/api/${API_VERSION}`, authRoutes);
app.use(`/api/${API_VERSION}`, userRoutes);
app.use(`/api/${API_VERSION}`, cursoRoutes);
app.use(`/api/${API_VERSION}`, seccionRoutes);
app.use(`/api/${API_VERSION}`, comprasRoutes);
app.use(`/api/${API_VERSION}`, carritoRoutes);
app.use(`/api/${API_VERSION}`, examRoutes);
app.use(`/api/${API_VERSION}`, answersRoutes);
app.use(`/api/${API_VERSION}`, resultsRoutes);

module.exports = app;
