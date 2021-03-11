// const { STRIPE_API_KEY } = require('../services');

exports.stripeApi = function () {
	stripe = require('stripe')(process.env.STRIPE_API_KEY, {
		apiVersion: process.env.STRIPE_API_VERSION,
	});
};
