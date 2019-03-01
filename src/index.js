const iotalib = require('@dojot/iotagent-nodejs');
const express = require('express');
const util = require('util');
const app = express()
app.use(express.json());

const dojotLib = require('@znti/dojot-web');

const emuPort = 8083;
const iota = new iotalib.IoTAgent();

console.log('Initializing emulator node...');

iota.init().then(() => {
	console.log('IoT Agent is up');
});

let dojot = new dojotLib();
dojot.configure('http://apigw:8000').then(configuredDojot => {
	console.log('Configured');
	configuredDojot.initializeWithCredentials({username:'admin', passwd:'admin'}).then(initializedDojot => {
		console.log('dojot client is up');
		dojot = configuredDojot;
	});
});

app.get('/', (req, res) => {
	res.status(200).send({message: 'dojot-emu up and running'});
});

app.get('/tenants', (req, res) => {
//	iota.init().then(() => {
		let tenants = iota.messenger.tenants;
		res.status(200).send({tenants});
//	}).catch(err => res.send(err));
});

app.post('/tenants', (req, res) => {

	let tenantName = req.body.name;
	let userName = `${tenantName}_admin`;
	let emailAddr = `${userName}@nomail.com`;

	if(!tenantName) {
		console.error('No tenant name defined');
		res.send(400);
	}

	let tenantData = {
		username: userName,
		service: tenantName,
		email: emailAddr,
		name: userName,
		profile: "admin",
	};

	dojot.Users.set(tenantData).then((data) => {
		res.status(201).send({
			message: `Tenant ${tenantName} created.`,
			credentials: {
				username: userName,
				password: 'temppwd',
			},
		});
	});
});

app.post('/tenants/:tenant/devices/:device/messages', (req, res) => {
	let {tenant, device} = req.params;
	let message = req.body;

//	iota.init().then(() => {
	
		let metadata = {
			timestamp: Date.now(),
		}
	
		iota.updateAttrs(device, tenant, message, metadata);
		res.status(200).send({tenant, device, message, metadata});
//	}).catch(err => res.send(err));
});

app.listen(emuPort, () => {
	console.log('dojot-emu listening on port', emuPort);
});

