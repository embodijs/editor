export class InvalidDataException extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InvalidDataException';
	}
}

export class JSONParseException extends InvalidDataException {
	constructor(protected file: string) {
		super(`Invalid JSON in ${file}`);
		this.name = 'JSONParseError';
	}
}
