import { config } from "dotenv";
config();

import { connect } from './discord/bot';
import { events, loadEvents } from "./events";
import { checkForEvents } from './notifications';


async function start() {
	await loadEvents();
	await connect();
	setInterval(() => checkForEvents(), 60000);
}

start();