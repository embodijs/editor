<script lang="ts">
	import * as Popover from '$lib/comp/ui/popover/index.js';
	import { Button } from '$lib/comp/ui/button/index.js';
	import { Calendar } from '$lib/comp/ui/calendar/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { parseDate } from 'chrono-node';
	import * as InputGroup from '$lib/comp/ui/input-group/index.js';
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { untrack } from 'svelte';

	type Props = {
		name: string;
		value?: Date;
		local: Intl.LocalesArgument;
	};

	let { name, value = $bindable(), local }: Props = $props();

	const formatDate = (date: DateValue | Date | string | undefined) => {
		if (!date) return '';
		if (date instanceof Date) {
			return date.toLocaleDateString('en', {
				day: '2-digit',
				month: 'long',
				year: 'numeric'
			});
		} else if (typeof date === 'string') {
			return date;
		}
		return date.toDate(getLocalTimeZone()).toLocaleDateString(local, {
			day: '2-digit',
			month: 'long',
			year: 'numeric'
		});
	};

	const id = $props.id();

	let open = $state(false);
	let internalValue = $state<DateValue | undefined>(
		untrack(() => {
			const date = value;
			if (date) return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
			return undefined;
		})
	);
</script>

<InputGroup.Input
	{name}
	value={formatDate(value)}
	onchange={(e: Event) => {
		const userInput = (e.target as HTMLInputElement).value;
		const date = parseDate(userInput);
		if (date) {
			value = date;
			internalValue = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
		}
	}}
	placeholder="Tomorrow or next week"
	class="bg-background pr-10"
	onkeydown={(e) => {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			open = true;
		}
	}}
/>
<InputGroup.Addon align="inline-end">
	<Popover.Root bind:open>
		<Popover.Trigger id="{id}-date-picker">
			{#snippet child({ props })}
				<Button {...props} variant="ghost" class="absolute top-1/2 right-2 size-6 -translate-y-1/2">
					<CalendarIcon />
					<span class="sr-only">Select date</span>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="end">
			<Calendar
				type="single"
				bind:value={internalValue}
				captionLayout="dropdown"
				onValueChange={(v) => {
					value = v?.toDate(getLocalTimeZone());
					open = false;
				}}
			/>
		</Popover.Content>
	</Popover.Root>
</InputGroup.Addon>
