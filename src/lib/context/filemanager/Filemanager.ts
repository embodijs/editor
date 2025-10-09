import type { FileUpload } from '$core/model/article';
import type { Writable } from 'svelte/store';

export class FileManager {
	protected store: Map<string, FileUpload>;

	constructor(
		protected gitCurrentDirPath: string,
		protected formStoreNewFiles: Writable<FileUpload[]>
	) {
		this.store = new Map();
	}

	protected async hash(file: File) {
		const buffer = await file.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

		return hashHex.substring(0, length);
	}

	protected addHashToFileName(name: string, hash: string): string {
		const lastDot = name.lastIndexOf('.');

		if (lastDot === -1) {
			// Keine Extension (z.B. "README")
			return `${name}-${hash}`;
		}

		const baseName = name.substring(0, lastDot);
		const extension = name.substring(lastDot); // inkl. "."

		return `${baseName}-${hash}${extension}`;
	}

	async set(file: File): Promise<string> {
		if (this.store.has(file.name)) {
			return this.store.get(file.name)!.relativePath;
		}
		const hash = await this.hash(file);
		const fileName = this.addHashToFileName(file.name, hash);
		const upload: FileUpload = {
			relativePath: `./${fileName}`,
			absolutePath: `${this.gitCurrentDirPath}/${fileName}`,
			blob: URL.createObjectURL(file)
		};
		this.store.set(upload.relativePath, upload);
		this.formStoreNewFiles.update((files) => [...files, upload]);
		return upload.relativePath;
	}

	async getFile(url: string): Promise<string> {
		if (this.store.has(url)) {
			return this.store.get(url)!.blob;
		}
		//TODO: Load data from server
		return Promise.resolve(url);
	}
}
