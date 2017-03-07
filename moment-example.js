var moment = require('moment');
var now = moment();

console.log(now.format("MMM Mo YYYY, H:mma"));
console.log(now.format('X'));
console.log(now.valueOf());

var timestamp = 1488887918898;
var timestampMoment = moment.utc(timestamp);

console.log(timestampMoment.local().format('H:mma'));