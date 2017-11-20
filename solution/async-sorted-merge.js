'use strict'

const _ = require('lodash')
const FastPriorityQueue = require("fastpriorityqueue");

module.exports = async (logSources, printer) => {
	let polledSource;
	let fastLogQueue = new FastPriorityQueue((a, b) => {
    return a.date < b.date;
	});
  let current = null;
  let currentSource;
  for (let i = 0; i < logSources.length; i++) {
    current = logSources[i];
    currentSource = null;
    while (currentSource !== false) {
        currentSource = await current.popAsync();
        if (currentSource) {
          fastLogQueue.add(currentSource);
        }
    }
  }
	while (!fastLogQueue.isEmpty()) {
		polledSource = fastLogQueue.poll();
		if (_.isDate(polledSource.date)) {
			printer.print(polledSource);
		}
	}
	printer.done();
}
