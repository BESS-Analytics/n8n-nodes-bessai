import { validateUUID, safeJsonParse } from '../nodes/BessAi/GenericFunctions';

// ─── Mock helpers ────────────────────────────────────────

function createMockContext(nodeName = 'BESS AI') {
	return {
		getNode: () => ({ name: nodeName, type: 'n8n-nodes-bessai.bessAi', typeVersion: 1, position: [0, 0], parameters: {} }),
		getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key', baseUrl: 'https://api.bess-ai.com' }),
		helpers: {
			httpRequestWithAuthentication: jest.fn(),
		},
	} as any;
}

// ─── validateUUID ────────────────────────────────────────

describe('validateUUID', () => {
	const ctx = createMockContext();

	it('accepts a valid v4 UUID', () => {
		const uuid = '550e8400-e29b-41d4-a716-446655440000';
		expect(validateUUID(ctx, uuid, 'Agent ID')).toBe(uuid);
	});

	it('trims whitespace from valid UUIDs', () => {
		const uuid = '  550e8400-e29b-41d4-a716-446655440000  ';
		expect(validateUUID(ctx, uuid, 'Agent ID')).toBe(uuid.trim());
	});

	it('accepts uppercase UUIDs', () => {
		const uuid = '550E8400-E29B-41D4-A716-446655440000';
		expect(validateUUID(ctx, uuid, 'Agent ID')).toBe(uuid);
	});

	it('rejects an empty string', () => {
		expect(() => validateUUID(ctx, '', 'Agent ID')).toThrow('Invalid UUID');
	});

	it('rejects a non-UUID string', () => {
		expect(() => validateUUID(ctx, 'not-a-uuid', 'Agent ID')).toThrow('Invalid UUID');
	});

	it('rejects a string with path traversal attempt', () => {
		expect(() => validateUUID(ctx, '../../../etc/passwd', 'Agent ID')).toThrow('Invalid UUID');
	});

	it('rejects a UUID with extra characters', () => {
		expect(() => validateUUID(ctx, '550e8400-e29b-41d4-a716-446655440000/../../hack', 'Agent ID')).toThrow('Invalid UUID');
	});

	it('includes the field name in the error message', () => {
		expect(() => validateUUID(ctx, 'bad', 'Batch Call ID')).toThrow('Batch Call ID');
	});
});

// ─── safeJsonParse ───────────────────────────────────────

describe('safeJsonParse', () => {
	const ctx = createMockContext();

	it('parses valid JSON object', () => {
		const result = safeJsonParse(ctx, '{"key": "value"}', 'Metadata');
		expect(result).toEqual({ key: 'value' });
	});

	it('parses valid JSON array', () => {
		const result = safeJsonParse(ctx, '[1, 2, 3]', 'Contacts');
		expect(result).toEqual([1, 2, 3]);
	});

	it('parses valid JSON string', () => {
		const result = safeJsonParse(ctx, '"hello"', 'Message');
		expect(result).toBe('hello');
	});

	it('parses valid JSON number', () => {
		const result = safeJsonParse(ctx, '42', 'Count');
		expect(result).toBe(42);
	});

	it('throws on invalid JSON', () => {
		expect(() => safeJsonParse(ctx, '{invalid}', 'Metadata')).toThrow('Invalid JSON');
	});

	it('throws on empty string', () => {
		expect(() => safeJsonParse(ctx, '', 'Metadata')).toThrow('Invalid JSON');
	});

	it('includes the field name in the error message', () => {
		expect(() => safeJsonParse(ctx, 'bad', 'Dynamic Variables')).toThrow('Dynamic Variables');
	});

	it('parses nested objects correctly', () => {
		const input = '{"contacts": [{"phone": "+1234"}], "meta": {"key": "val"}}';
		const result = safeJsonParse(ctx, input, 'Payload');
		expect(result.contacts).toHaveLength(1);
		expect(result.meta.key).toBe('val');
	});
});
