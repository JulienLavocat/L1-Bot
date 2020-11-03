import { EmbedFieldData, MessageEmbed } from "discord.js";
import * as admin from "firebase-admin";
import { DateTime } from "luxon";
import { zoomLinks } from './zoomLinks';

let events: Event[];
const imgRefs: { [key: string]: string } = {
	"4TPV101U": "chemistry.png",
	"4TPV102U": "mathematics.png",
	"4TPV103U": "physics.png",
	"4TPV104U": "geology.png",
	"4TPV105U": "biology.png",
	"4TPV106U": "chemistry-work.png",
	"4TPV107U": "biology-challenges.png",
	"4TPV108U": "english.png",
};

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: process.env.FIREBASE_DB_URL,
});

export async function loadEvents() {
	const data = (await admin.firestore().doc("/events/F41").get()).data();
	if (!data) throw new Error("No data found.");

	events = data.events.map((e: any) => new Event(e));
}

export { events };

export class Event {
	prettyTimes: string;
	startTime: DateTime;
	endTime: DateTime;
	category: string;
	notes: string;
	room: string;
	module: string;
	staff: string;
	code: string;
	img: string;
	sent: boolean;

	constructor(obj: any) {
		this.prettyTimes = obj.prettyTimes;
		this.startTime = DateTime.fromMillis(obj.startTime.toMillis());
		this.endTime = DateTime.fromMillis(obj.endTime.toMillis());
		this.category = obj.category;
		this.notes = obj.notes;
		this.room = obj.room;
		this.staff = obj.staff;
		this.sent = false;

		const split: string[] = obj.module.replace(/\s\s+/g, " ").split(" ");
		if (split[0].startsWith("4TPV")) {
			this.code = split[0];
			this.module = split.slice(1).join(" ").trim();
		} else {
			this.module = obj.module;
			this.code = "";
		}

		this.img = imgRefs[this.code] || "";
	}

	getHours() {
		return (
			this.startTime.toFormat("HH:mm") +
			" - " +
			this.endTime.toFormat("HH:mm")
		);
	}
	getDate() {
		return this.startTime.toFormat("dd/MM/yyyy");
	}

	toDiscordMessage() {
		return this.startTime.toFormat("dd/MM/yyyy") + " - " + this.module;
	}
	toEmbedField(): EmbedFieldData {
		return {
			name: this.getHours(),
			value: `${this.module} (${this.code})`,
		};
	}
	toNotification() {

		const zoom = zoomLinks[this.code][this.category];

		return new MessageEmbed()
			.setColor("AQUA")
			.setDescription(`**${this.getHours()}**\n${this.module}`)
			//.addField(this.getHours(), this.module)
			.addFields(zoom ? [{name: "Lien Zoom", value: zoom}] : [])
			.attachFiles(["./assets/" + this.img])
			.setThumbnail("attachment://" + this.img);
	}
}
