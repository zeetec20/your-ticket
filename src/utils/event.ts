import { customAlphabet } from "nanoid";
import { IGuest } from "../db/schema";
import { IEvent } from "../db/schema/events";
import QRCode from "qrcode";
import { isWord } from "./regex";

type IEventNormalized = IEvent & { isDone: boolean; isGoingOn: boolean };

export const eventNormalize = (event: IEvent): IEventNormalized => {
  const now = new Date(event.date);
  const nowEnd = new Date();
  const [hourEnd, minuteEnd] = event.timeEnd.split("-");
  nowEnd.setHours(Number(hourEnd), Number(minuteEnd), 0, 0);

  const nowStart = new Date();
  const [hourStart, minuteStart] = event.timeStart.split("-");
  nowStart.setHours(Number(hourStart), Number(minuteStart), 0, 0);

  return {
    ...event,
    isDone: nowEnd.getTime() > now.getTime(),
    isGoingOn:
      nowStart.getTime() < now.getTime() && nowEnd.getTime() > now.getTime(),
  };
};

export const createQrGuest = async (guest: IGuest) => {
  const qrPath = `public/storage/guest-qr/${guest.code}.png`;
  const buffer = await QRCode.toBuffer(btoa(guest.id), {
    color: { light: "#0000", dark: "#000000" },
  });
  await Bun.write(qrPath, buffer);
  return qrPath;
};

export const createCodeGuest = (event: IEvent) => {
  const suffixCode = event.organizer
    .split(" ")
    .map((char) => (isWord(char[0]) ? char[0].toUpperCase() : undefined))
    .filter((char) => char != undefined)
    .join("");
  return `${suffixCode}-${customAlphabet("1234567890", 5)()}`;
};

export const getGuestQRPath = (guest: IGuest) =>
  `public/storage/guest-qr/${guest.code}.png`;
