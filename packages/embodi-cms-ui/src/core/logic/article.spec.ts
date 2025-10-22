import { test, expect, describe } from 'vitest';
import { flatMeta, unflatMeta } from './article';

describe('Article', () => {
	test('flat meta data with flatMeta', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: '2022-01-01',
				tags: ['test', 'article']
			}
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': '2022-01-01',
			'meta.tags': ['test', 'article']
		};
		expect(flatMeta(article)).toEqual(expected);
	});

	test('flat meta data with flatMeta keep Date', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: new Date('2022-01-01'),
				tags: ['test', 'article']
			}
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': new Date('2022-01-01'),
			'meta.tags': ['test', 'article']
		};
		expect(flatMeta(article)).toEqual(expected);
	});

	test('unflat meta data with unflatMeta', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': '2022-01-01',
			'meta.tags': ['test', 'article']
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: '2022-01-01',
				tags: ['test', 'article']
			}
		};
		expect(unflatMeta(article)).toEqual(expected);
	});

	test('unflat multilevel object', () => {
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author.name': 'John Doe',
			'meta.author.email': 'john.doe@example.com',
			'meta.date': '2022-01-01',
			'meta.tags': ['test', 'article']
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: {
					name: 'John Doe',
					email: 'john.doe@example.com'
				},
				date: '2022-01-01',
				tags: ['test', 'article']
			}
		};
		expect(unflatMeta(article)).toEqual(expected);
	});

	test.skip('unflat multilevel data with array', () => {
		//TODO: Currently not supported
		const article = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			'meta.author': 'John Doe',
			'meta.date': '2022-01-01',
			'meta.tags': ['test', 'article'],
			'meta.comments': [
				{
					id: '1',
					content: 'This is a test comment.',
					'meta.author': 'Jane Doe',
					'meta.date': '2022-01-02'
				}
			]
		};
		const expected = {
			id: '1',
			title: 'Test Article',
			content: 'This is a test article.',
			meta: {
				author: 'John Doe',
				date: '2022-01-01',
				tags: ['test', 'article'],
				comments: [
					{
						id: '1',
						content: 'This is a test comment.',
						meta: {
							author: 'Jane Doe',
							date: '2022-01-02'
						}
					}
				]
			}
		};
		expect(unflatMeta(article)).toEqual(expected);
	});
});
