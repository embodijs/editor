<script lang="ts">
	import * as Popover from '$lib/comp/ui/popover/index.js';
	import { Button } from '$lib/comp/ui/button/index.js';
	import { Calendar } from '$lib/comp/ui/calendar/index.js';
	import { Input } from '$lib/comp/ui/input/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { parseDate } from 'chrono-node';
	import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import { untrack } from 'svelte';
	import { twoDigit } from '$core/logic/date';

	type Props = {
		name: string;
		value?: string;
		local: Intl.LocalesArgument;
		'data-slot'?: string;
		class?: string;
	};

	let { name, value = $bindable(), local, ...props }: Props = $props();

	const formatDate = (date: DateValue | Date | string | undefined): string => {
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

	const toIsoString = (date: DateValue | Date | string | undefined): string => {
		if (!date) return '';
		if (date instanceof Date) {
			return `${date.getFullYear()}-${twoDigit(date.getMonth() + 1)}-${twoDigit(date.getDate())}`;
		} else if (typeof date === 'string') {
			return date;
		}
		return toIsoString(date.toDate(getLocalTimeZone()));
	};

	const id = $props.id();

	let open = $state(false);
	let internalValue = $state<DateValue | undefined>(
		untrack(() => {
			if (value) {
				const date = new Date(value);
				return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
			}
			return undefined;
		})
	);
</script>

<div class="relative flex w-full gap-2" data-slot="input-group-control">
	<Input
		{name}
		{...props}
		value={formatDate(internalValue)}
		onchange={(e: Event) => {
			const userInput = (e.target as HTMLInputElement).value;
			const date = parseDate(userInput);
			if (date) {
				internalValue = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
				value = toIsoString(internalValue);
			}
		}}
		placeholder="Tomorrow or next week"
		onkeydown={(e) => {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				open = true;
			}
		}}
	/>

	<Popover.Root bind:open>
		<Popover.Trigger id="{id}-date-picker">
			{#snippet child({ props })}
				<Button {...props} variant="ghost" class="absolute top-1/2 right-2 size-6 -translate-y-1/2">
					<CalendarIcon class="size-3.5" />
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
					value = toIsoString(v);
					open = false;
				}}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
