import { DateTime } from "luxon";
import { events, Event } from "../../events";
import { MessageAttachment, MessageEmbed, TextChannel } from "discord.js";
import { getLocale } from "../../locales";
import * as path from "path";
import Canvas from "canvas";
import { EventsCanvas } from "./utils/EventsCanvas";

const EDT_URL =
	"https://edt-st.u-bordeaux.fr/etudiants/Licence1/Semestre1/g519569.html";
const locale = getLocale();
const LOCALE_VALUE = process.env.LOCALE || "en";

export function eventsCommand(args: string[], channel: TextChannel) {
	const days = args.length === 0 ? 0 : parseInt(args[0]) || 0;

	//reply(channel, days);
	replyImg(channel, days);
}

function reply(channel: TextChannel, days: number) {
	const eventString = getEventsFromToday(days).map((e) => e.toEmbedField());

	const today = DateTime.utc()
		.startOf("day")
		.plus({ days })
		.setLocale(LOCALE_VALUE)
		.toLocaleString(DateTime.DATE_HUGE);

	const embed = new MessageEmbed()
		.setColor("BLUE")
		.setTitle(locale.EVENTS_REPLY_TITLE.replace("%d", today))
		.addFields(
			eventString.length > 0
				? eventString
				: [{ name: locale.EVENTS_EMPTY, value: "\u200b" }]
		)
		.setURL(EDT_URL)
		.setTimestamp();

	channel.send(embed);
}

function getEventsFromToday(days: number) {
	const from = DateTime.utc().startOf("day").plus({ days });
	const to = DateTime.utc().endOf("day").plus({ days });
	return events.filter((e) => e.startTime > from && e.startTime < to);
}

async function replyImg(channel: TextChannel, days: number) {
	const filteredEvents = getEventsFromToday(days);
	let date = DateTime.utc()
		.startOf("day")
		.plus({ days })
		.setLocale(LOCALE_VALUE)
		.toLocaleString(DateTime.DATE_HUGE);
	date = date.charAt(0).toUpperCase() + date.slice(1);

	channel.send(
		(await new EventsCanvas(filteredEvents, date).draw()).toMessageAttachement()
	);
}
