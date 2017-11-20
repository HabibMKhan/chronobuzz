'use strict'

const _ = require('lodash')
const FastPriorityQueue = require("fastpriorityqueue");

module.exports = (logSources, printer) => {
	let polledSource;
	let fastLogQueue = new FastPriorityQueue((a, b) => {
		return a.date < b.date;
	});

	let storage = [];
	let current = logSources[0].last.date || '';
	logSources.forEach((source) => {
		// logQueue.queue(source.last.date);
		fastLogQueue.add(source.last);
		storage.push(source);
		if (current < source.last.date) {
			current = source.last.date;
		}
	});
	// console.log('printing logQueue', logQueue);
	while (!fastLogQueue.isEmpty()) {
		polledSource = fastLogQueue.poll();
		if (_.isDate(polledSource.date)) {
			printer.print(polledSource);
		}
	}
	printer.done();
	// throw new Error('Not implemented yet!  That part is up to you!')
}
