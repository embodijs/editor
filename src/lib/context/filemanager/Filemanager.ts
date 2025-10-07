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

	set(file: File): string {
		if (this.store.has(file.name)) {
			return this.store.get(file.name)!.relativePath;
		}
		const upload: FileUpload = {
			relativePath: `./${file.name}`,
			absolutePath: `${this.gitCurrentDirPath}/${file.name}`,
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
