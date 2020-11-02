export interface Locale {

	EVENTS_REPLY_TITLE: string;
	EVENTS_EMPTY: string;

}

const en: Locale = {
	EVENTS_REPLY_TITLE: "%d event's are:",
	EVENTS_EMPTY: "No events scheduled for today."
}

const fr: Locale = {
	EVENTS_REPLY_TITLE: "Événements pour le %d :",
	EVENTS_EMPTY: "Aucuns événements prévu ce jour."
}

const locales: {[key: string]: Locale} = {
	en,
	fr,
};

export function getLocale() {
	return locales[process.env.LOCALE || "en"];
}
