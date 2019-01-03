const iotalib = require('@dojot/iotagent-nodejs');
const express = require('express');
const util = require('util');
const app = express()
app.use(express.json());

const iotaPort = 8083;
const iota = new iotalib.IoTAgent();

console.log("Initializing custom IoT agent...");

app.get('/', (req, res) => {
	res.status(200).send({message: 'customIoTAgent is on'});
});

app.get('/tenants', (req, res) => {
	iota.init().then(() => {
		let tenants = iota.messenger.tenants;
		res.status(200).send({tenants});
	}).catch(err => res.send(err));
});

app.post('/tenants/:tenant/devices/:device/messages', (req, res) => {
	let {tenant, device} = req.params;
	let message = req.body;

	iota.init().then(() => {
	
		let metadata = {
			timestamp: Date.now(),
		}
	
		iota.updateAttrs(device, tenant, message, metadata);
		res.status(200).send({tenant, device, message, metadata});
	}).catch(err => res.send(err));
});

app.listen(iotaPort, () => {
	console.log('iotagent listening on port', iotaPort);
});
