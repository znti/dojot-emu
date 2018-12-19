const iotalib = require('@dojot/iotagent-nodejs');
const express = require('express');

const util = require('util');

const app = express()

const iotaPort = 8083;

console.log("Initializing custom IoT agent...");
const iota = new iotalib.IoTAgent();
iota.init();
console.log("... custom IoT agent was initialized");

app.get('/', (req, res) => {
	res.status(200).send({message: 'customIoTAgent is on', iota: util.inspect(iota)});
});

app.listen(iotaPort, () => {
	console.log('iotagent listening on port', iotaPort);
});
