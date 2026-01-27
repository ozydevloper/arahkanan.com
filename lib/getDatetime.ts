// getDatetime.ts
import { startOfDay, addDays, endOfWeek } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

const USER_TIMEZONE = "Asia/Jakarta";

export const getHariIni = (thisWeek: boolean = false) => {
  const now = new Date();

  // 00:00 hari ini (versi user)
  const startLocal = startOfDay(now);

  let endLocal: Date;

  if (thisWeek) {
    // Minggu di minggu ini (versi user)
    endLocal = addDays(endOfWeek(startLocal), 1);
  } else {
    // Besok 00:00 (versi user)
    endLocal = addDays(startLocal, 1);
  }

  return {
    gt: fromZonedTime(startLocal, USER_TIMEZONE),
    lt: fromZonedTime(endLocal, USER_TIMEZONE),
  };
};
