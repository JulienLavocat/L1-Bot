import Canvas from "canvas";
import { MessageAttachment } from "discord.js";
import * as path from "path";
import { Event } from "../../../events";

// Canvas drawing parameters
const LOGO_SIZE = 256;
const BORDERS_MARGIN = 25;
const EVENTS_MARGIN = 50;
const EVENT_TITLE_SIZE = 60;
const EVENT_TIME_SIZE = 60;
const HEADER_SIZE = 50 + EVENT_TITLE_SIZE + 25;
const HEADER_TEXT_COLOR = "#3b3b3b";

export class EventsCanvas {
	events: Event[];
	canvas: Canvas.Canvas;
	ctx: Canvas.CanvasRenderingContext2D;
	date: string;

	constructor(events: Event[], date: string) {
		this.events = events;
		this.canvas = Canvas.createCanvas(1300, HEADER_SIZE + (EVENTS_MARGIN + LOGO_SIZE) * events.length + BORDERS_MARGIN);
		this.ctx = this.canvas.getContext("2d");
		this.date = date;
	}

	async draw() {
		this.drawBackground();
		this.drawTitle();
		await Promise.all(this.events.map((e, i) => this.drawEvent(e, i)));
		return this;
	}

	drawBackground() {
		this.ctx.fillStyle = "#fcf8eb";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	drawTitle() {
		this.ctx.textAlign = "center";
		this.ctx.fillStyle = HEADER_TEXT_COLOR;
		this.ctx.font = EVENT_TITLE_SIZE + "px sans-serif";
		this.ctx.fillText(this.date, this.canvas.width / 2, 80);
		this.ctx.textAlign = "left";
	}

	async drawEvent(event: Event, index: number) {
		const posX = BORDERS_MARGIN + LOGO_SIZE + BORDERS_MARGIN * 2;
		const yOffset = index * (EVENTS_MARGIN + LOGO_SIZE);

		const logo = await Canvas.loadImage(
			path.join(__dirname, "../../../../assets", event.img)
		);
		this.ctx.drawImage(
			logo,
			BORDERS_MARGIN,
			HEADER_SIZE + yOffset,
			LOGO_SIZE,
			LOGO_SIZE
		);

		this.ctx.font = EVENT_TITLE_SIZE + "px sans-serif";
		this.ctx.fillStyle = "#545454";

		this.ctx.fillText(
			event.getHours() + " " + event.category,
			posX,
			(HEADER_SIZE + LOGO_SIZE / 2 - EVENT_TITLE_SIZE / 2) + yOffset
		);
		this.ctx.fillText(
			event.module,
			posX,
			(HEADER_SIZE + LOGO_SIZE / 2 + EVENT_TITLE_SIZE / 2) + yOffset
		);
	}

	toMessageAttachement() {
		return new MessageAttachment(this.canvas.toBuffer(), "edt.png");
	}
}
