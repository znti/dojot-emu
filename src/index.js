const iotalib = require('@dojot/iotagent-nodejs');
const express = require('express');

const util = require('util');

const app = express()

const iotaPort = 8083;

console.log("Initializing custom IoT agent...");
const iota = new iotalib.IoTAgent();
iota.init();
console.log("... custom IoT agent was initialized", iota);

console.log(iota.messenger.tenants)

app.get('/', (req, res) => {
	res.status(200).send({message: 'customIoTAgent is on', iota: util.inspect(iota)});
});

app.get('/tenants', (req, res) => {
	let tenants = iota.messenger.tenants;
	res.status(200).send({tenants});
});

app.listen(iotaPort, () => {
	console.log('iotagent listening on port', iotaPort);
});
