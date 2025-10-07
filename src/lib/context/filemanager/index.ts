import type { FileUpload } from '$core/model/article';
import type { Writable } from 'svelte/store';
import { FileManager } from './Filemanager';
import { getContext, setContext, hasContext } from 'svelte';

const key = Symbol('FileManager');

export const initFileContext = (
	gitCurrentDirPath: string,
	formStoreNewFiles: Writable<FileUpload[]>
) => {
	const fileManage = new FileManager(gitCurrentDirPath, formStoreNewFiles);
	setContext(key, fileManage);
	return fileManage;
};

export const getFileContext = (): FileManager | undefined => {
	return getContext(key);
};

export const hasFileContext = (): boolean => {
	return hasContext(key);
};
