<script lang="ts" generics="T extends Record<string, unknown>">
	import type { ArrayField } from '$core/model/collection';
	import type { SuperForm } from 'sveltekit-superforms';
	import FieldMatcher from './FieldMatcher.svelte';
	import * as Field from '$lib/comp/ui/field/index.js';
	import { getLabel, getPathValue, setPathValue } from './helpers.svelte.js';
	import { generateRandomHash } from '$/lib/helpers/crypto';
	import { Button } from '../core';
	import * as Card from '$lib/comp/ui/card/index.js';
	import { untrack } from 'svelte';
	import * as ButtonGroup from '../ui/button-group/index.js';
	import { ChevronDown, ChevronUp, X } from '@lucide/svelte';

	type Props = {
		field: ArrayField;
		form: SuperForm<T>;
		objectPath: (string | number)[];
	};

	const { field, form, objectPath }: Props = $props();
	const { form: formData } = form;

	let fieldState: string[] = $state.raw(
		untrack(() =>
			((getPathValue($formData, objectPath) as unknown[]) ?? []).map((item) => {
				return generateRandomHash();
			})
		)
	);

	const addHelper = <T,>(arr: T[], index: number, value: T) =>
		[...arr.slice(0, index), value, ...arr.slice(index)] as T[];

	const addItemAt = (index: number) => () => {
		fieldState = addHelper(fieldState, index, generateRandomHash());
		const content = getPathValue($formData, objectPath) as unknown[];
		formData.update((data) => {
			return setPathValue(data, objectPath, addHelper(content, index, undefined));
		});
	};

	const removeItem = (index: number) => () => {
		fieldState = fieldState.filter((_, i) => i !== index);
		formData.update((data) => {
			const content = getPathValue(data, objectPath) as unknown[];
			return setPathValue(
				data,
				objectPath,
				content.filter((_, i) => i !== index)
			);
		});
	};

	const upHelper = <T extends unknown[]>(arr: T, index: number): T =>
		[
			...(index !== 0 ? arr.slice(0, index - 1) : []),
			arr[index],
			arr[index - 1],
			...arr.slice(index + 1)
		] as T;
	const moveItemUp = (index: number) => () => {
		fieldState = upHelper(fieldState, index);
		const content = getPathValue($formData, objectPath) as unknown[];
		formData.update((data) => {
			return setPathValue(data, objectPath, upHelper(content, index));
		});
	};

	const downHelper = <T extends unknown[]>(arr: T, index: number) =>
		[...arr.slice(0, index), arr[index + 1], arr[index], ...arr.slice(index + 2)] as T;
	const moveItemDown = (index: number) => () => {
		fieldState = downHelper(fieldState, index);
		const content = getPathValue($formData, objectPath) as unknown[];
		formData.update((data) => {
			return setPathValue(data, objectPath, downHelper(content, index));
		});
	};
</script>

<Field.Set>
	<Field.Legend class="flex w-full items-center justify-between">
		{getLabel(field)}
		<Button variant="ghost" size="sm" class="text-xs" onclick={addItemAt(0)}>Add</Button>
	</Field.Legend>
	<div class="flex flex-col gap-5">
		{#each fieldState as item, index (item)}
			<Card.Root>
				<Card.Header>
					<Card.Title>
						Entry {index + 1} <span class="text-muted-foreground">of {getLabel(field)}</span>
					</Card.Title>
					<Card.Action>
						<ButtonGroup.Root>
							{#if fieldState.length > 1}
								<ButtonGroup.Root>
									<Button
										disabled={index === 0}
										variant="outline"
										onclick={moveItemUp(index)}
										title="Move up"><ChevronUp /></Button
									>
									<Button
										disabled={index === fieldState.length - 1}
										variant="outline"
										onclick={moveItemDown(index)}
										title="Move down"><ChevronDown /></Button
									>
								</ButtonGroup.Root>
							{/if}
							<ButtonGroup.Root>
								<Button variant="outline" onclick={removeItem(index)}><X /></Button>
							</ButtonGroup.Root>
						</ButtonGroup.Root>
					</Card.Action>
				</Card.Header>
				<Card.Content>
					<FieldMatcher
						field={field.items}
						{form}
						objectPath={[...objectPath, index]}
						class="mt-0 mb-0"
					/>
				</Card.Content>
			</Card.Root>
			<Button variant="outline" onclick={addItemAt(index + 1)}
				>Add Entry <span class="text-muted-foreground">to {getLabel(field)}</span></Button
			>
		{/each}
	</div>
</Field.Set>
