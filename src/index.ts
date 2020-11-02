import { config } from "dotenv";
config();

import { connect } from './discord/bot';
import { events, loadEvents } from "./events";
import { checkForEvents, initEvents } from './notifications';


async function start() {
	await loadEvents();
	await connect();
	initEvents();
	setInterval(() => checkForEvents(), 60000);
}

start();