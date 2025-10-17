export const camelToReadable = (str: string) => {
	return str
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // Akronyme: "URLParser" → "URL Parser"
		.replace(/([a-z\d])([A-Z])/g, '$1 $2') // Normal: "myURL" → "my URL"
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.trim()
		.split(' ')
		.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ');
};
