'use strict'

const _ = require('lodash')
const FastPriorityQueue = require("fastpriorityqueue");

module.exports = (logSources, printer) => {
	let polledSource;
	let fastLogQueue = new FastPriorityQueue((a, b) => {
		return a.date < b.date;
	});
	let current = logSources[0].last.date || '';
	logSources.forEach((source) => {
		fastLogQueue.add(source.last);
		if (current < source.last.date) {
			current = source.last.date;
		}
	});
	while (!fastLogQueue.isEmpty()) {
		polledSource = fastLogQueue.poll();
		if (_.isDate(polledSource.date)) {
			printer.print(polledSource);
		}
	}
	printer.done();
}
