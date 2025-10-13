export const twoDigit = (number: number) => ('0' + number).slice(-2);

export const toIsoDate = (date: Date) =>
	`${date.getFullYear()}-${twoDigit(date.getMonth() + 1)}-${twoDigit(date.getDate())}`;
