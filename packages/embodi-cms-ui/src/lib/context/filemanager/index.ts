import { FileManager } from './Filemanager';
import { getContext, setContext, hasContext } from 'svelte';

const key = Symbol('FileManager');

export const initFileContext = (...args: ConstructorParameters<typeof FileManager>) => {
	const fileManage = new FileManager(...args);
	setContext(key, fileManage);
	return fileManage;
};

export const getFileContext = (): FileManager | undefined => {
	return getContext(key);
};

export const hasFileContext = (): boolean => {
	return hasContext(key);
};
