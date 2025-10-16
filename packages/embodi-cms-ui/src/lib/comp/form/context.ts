import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

export const INPUT_FRAME_CONTEXT = Symbol('INPUT_FRAME_CONTEXT');

export interface FrameContext {
	errors: Writable<Record<string, string[]>>;
}

export const initFrameContext = () => {
	const errors = writable<Record<string, string[]>>({});

	const context = {
		errors
	};

	setContext(INPUT_FRAME_CONTEXT, context);

	return context;
};

export const getFrameContext = () => {
	return getContext<FrameContext>(INPUT_FRAME_CONTEXT);
};
