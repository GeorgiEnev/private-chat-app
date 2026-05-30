export const ROOM_EXPIRY_UNITS = [
  {
    label: "minutes",
    value: "minutes",
    minutes: 1,
  },
  {
    label: "hours",
    value: "hours",
    minutes: 60,
  },
  {
    label: "days",
    value: "days",
    minutes: 1_440,
  },
] as const;

export const MIN_ROOM_EXPIRY_MINUTES = 5;
export const MAX_ROOM_EXPIRY_MINUTES = 30 * 24 * 60;

export type RoomExpiryUnit = (typeof ROOM_EXPIRY_UNITS)[number]["value"];

export type RoomExpiryDuration = {
  amount: number;
  unit: RoomExpiryUnit;
};

export function getRoomExpiryMinutes(duration: RoomExpiryDuration | null) {
  if (duration === null) {
    return null;
  }

  const unit = ROOM_EXPIRY_UNITS.find((option) => option.value === duration.unit);

  if (!unit || !Number.isInteger(duration.amount)) {
    return null;
  }

  return duration.amount * unit.minutes;
}

export function isValidRoomExpiryDuration(duration: RoomExpiryDuration | null) {
  if (duration === null) {
    return true;
  }

  const expiresInMinutes = getRoomExpiryMinutes(duration);

  return (
    expiresInMinutes !== null &&
    expiresInMinutes >= MIN_ROOM_EXPIRY_MINUTES &&
    expiresInMinutes <= MAX_ROOM_EXPIRY_MINUTES
  );
}

export function getRoomExpiresAt(duration: RoomExpiryDuration | null) {
  const expiresInMinutes = getRoomExpiryMinutes(duration);

  if (expiresInMinutes === null) {
    return null;
  }

  return new Date(Date.now() + expiresInMinutes * 60 * 1_000);
}

export function formatRoomExpiryDuration(duration: RoomExpiryDuration) {
  const unitLabel =
    duration.amount === 1 ? duration.unit.replace(/s$/, "") : duration.unit;

  return `${duration.amount} ${unitLabel}`;
}
