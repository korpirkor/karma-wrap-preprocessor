'use strict';

var _ = require('lodash');
var fs = require('fs');
var path = require('path');

function factory(logger, basePath, config) {
	var log = logger.create('preprocessor.html2js');
	var template = config.template;
	if (config.file) {
		template = fs.readFileSync(path.resolve(basePath, config.file));
	}

	return function (content, file, done) {
		log.debug('Processing "%s".', file.originalPath);
		var data = {};
		data[config.fileVariable || 'file'] = path.relative(basePath, file.path);
		data[config.variable || 'contents'] = content;

		if(_.isFunction(template)) {
			done(template(data, config.options));
		} else {
			done(_.template(template, data, config.options || {}));
		}
	};
}

factory.$inject = ['logger', 'config.basePath', 'config.wrapPreprocessor'];

module.exports = {
	'preprocessor:wrap': ['factory', factory]
};
