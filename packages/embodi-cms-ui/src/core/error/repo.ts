export class GitFileNotFoundException extends Error {
	constructor(message: string = 'File not found on repository') {
		super(message);
		this.name = 'GitFileNotFoundError';
	}
}
