import { Event, events } from "./events";
import { DateTime, Interval } from "luxon";
import { broadcast } from "./discord/bot";
import { zoomLinks } from "./zoomLinks";

export function checkForEvents() {
	const interval = Interval.fromDateTimes(
		DateTime.utc(),
		DateTime.utc().plus({ minutes: 5 })
	);
	const filtered = events.filter(
		(e) => interval.contains(e.startTime) && !e.sent
	);

	for (const event of filtered) {
		broadcast(
			"NotificationsCours",
			"Un cours commence !",
			event.toNotification()
		);

		event.sent = true;
	}
}
