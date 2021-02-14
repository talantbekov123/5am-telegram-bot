/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

module.exports = (url) => {
	const mongoose = require('mongoose');
	const glob = require('glob');

	const db = {
		connect(databaseUrl) {
			return mongoose.connect(databaseUrl);
		}
	};

	const models = glob.sync(url);
	models.forEach((model) => {
		/* reconstruct model path */
		model = `.${model.substring(url.length - 12)}`;
		require(model)(db);
	});

	return db;
};
