import {
	Client,
	Guild,
	TextChannel,
	MessageEmbed,
	EmbedFieldData,
} from "discord.js";
import { messaging } from "firebase-admin";
import { DateTime } from "luxon";
import { Event, events } from "../events";
import { eventsCommand } from "./commands/events";

const client = new Client();
const PREFIX = process.env.PREFIX || "";

client.on("ready", () => console.log("Connected to Discord."));

client.on("guildCreate", (g) => setupGuild(g));

client.on("message", (m) => {
	if (!m.content.startsWith(PREFIX)) return;

	const args = m.content.split(" ").splice(1);

	switch (args[0]) {
		case "events":
			eventsCommand(args.splice(1), m.channel as TextChannel);
			break;
		case "testEvent":
			broadcast(
				"NotificationsCours",
				"Un cours commence !",
				new Event({
					startTime: DateTime.utc().plus({ minute: 1 }),
					endTime: DateTime.utc().plus({ hour: 1 }),
					module: "4TPV104U Test event",
					category: "Cours",
				}).toNotification()
			);
			break;

		default:
			break;
	}
});

function setupGuild(g: Guild) {
	console.log("Joined a new guild: " + g.name);

	g.roles.create({ data: { name: "NotificationsCours", mentionable: true } });
}

export function broadcast(role: string, title: string, msg: MessageEmbed) {
	client.guilds.cache.forEach((g) => {
		const r = g.roles.cache.find((r) => r.name === role);
		if (!r) return;

		const c = g.channels.cache.find(
			(c) => c.name === process.env.CHANNEL_NAME
		) as TextChannel;
		if (!c) return;

		msg.setTitle(`${title}`);
		msg.addField("\u200b", `<@&${r.id}>`, true);

		c?.send(msg);
	});
}

export function connect() {
	return client.login(process.env.DISCORD_TOKEN);
}
