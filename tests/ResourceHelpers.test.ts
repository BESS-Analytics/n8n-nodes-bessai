import {
	handleAgentOperation,
	handleCallOperation,
	handlePhoneNumberOperation,
	handleBatchCallOperation,
	handleAnalyticsOperation,
} from '../nodes/BessAi/ResourceHelpers';

// ─── Mock GenericFunctions ───────────────────────────────

jest.mock('../nodes/BessAi/GenericFunctions', () => {
	const actual = jest.requireActual('../nodes/BessAi/GenericFunctions');
	return {
		...actual,
		bessApiRequest: jest.fn(),
		bessApiRequestAllItems: jest.fn(),
	};
});

import { bessApiRequest, bessApiRequestAllItems } from '../nodes/BessAi/GenericFunctions';

const mockBessApiRequest = bessApiRequest as jest.Mock;
const mockBessApiRequestAllItems = bessApiRequestAllItems as jest.Mock;

// ─── Mock context factory ────────────────────────────────

function createMockExecuteFunctions(params: Record<string, any> = {}) {
	return {
		getNode: () => ({ name: 'BESS AI', type: 'n8n-nodes-bessai.bessAi', typeVersion: 1, position: [0, 0], parameters: {} }),
		getNodeParameter: jest.fn((name: string) => params[name]),
		getCredentials: jest.fn().mockResolvedValue({ apiKey: 'test-key' }),
		helpers: {
			httpRequestWithAuthentication: jest.fn(),
		},
	} as any;
}

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

// ─── Agent Operations ────────────────────────────────────

describe('handleAgentOperation', () => {
	beforeEach(() => {
		mockBessApiRequest.mockReset();
		mockBessApiRequestAllItems.mockReset();
	});

	it('creates an agent', async () => {
		const ctx = createMockExecuteFunctions({
			name: 'My Agent',
			additionalFields: { voice: 'alloy' },
		});
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID, name: 'My Agent' });

		const result = await handleAgentOperation.call(ctx, 'create', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/agents', { name: 'My Agent', voice: 'alloy' });
		expect(result.id).toBe(VALID_UUID);
	});

	it('deletes an agent with valid UUID', async () => {
		const ctx = createMockExecuteFunctions({ agentId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({});

		const result = await handleAgentOperation.call(ctx, 'delete', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('DELETE', `/api/v1/agents/${VALID_UUID}`);
		expect(result).toEqual({ success: true });
	});

	it('rejects delete with invalid UUID', async () => {
		const ctx = createMockExecuteFunctions({ agentId: 'invalid-id' });
		await expect(handleAgentOperation.call(ctx, 'delete', 0)).rejects.toThrow('Invalid UUID');
	});

	it('gets an agent by ID', async () => {
		const ctx = createMockExecuteFunctions({ agentId: VALID_UUID });
		const agent = { id: VALID_UUID, name: 'Test' };
		mockBessApiRequest.mockResolvedValue(agent);

		const result = await handleAgentOperation.call(ctx, 'get', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', `/api/v1/agents/${VALID_UUID}`);
		expect(result).toEqual(agent);
	});

	it('rejects get with path traversal', async () => {
		const ctx = createMockExecuteFunctions({ agentId: '../../../etc/passwd' });
		await expect(handleAgentOperation.call(ctx, 'get', 0)).rejects.toThrow('Invalid UUID');
	});

	it('gets many agents with returnAll', async () => {
		const ctx = createMockExecuteFunctions({ returnAll: true });
		mockBessApiRequestAllItems.mockResolvedValue([{ id: '1' }, { id: '2' }]);

		const result = await handleAgentOperation.call(ctx, 'getMany', 0);
		expect(mockBessApiRequestAllItems).toHaveBeenCalledWith('GET', '/api/v1/agents');
		expect(result).toHaveLength(2);
	});

	it('gets many agents with limit', async () => {
		const ctx = createMockExecuteFunctions({ returnAll: false, limit: 5 });
		mockBessApiRequestAllItems.mockResolvedValue([{ id: '1' }]);

		await handleAgentOperation.call(ctx, 'getMany', 0);
		expect(mockBessApiRequestAllItems).toHaveBeenCalledWith('GET', '/api/v1/agents', {}, {}, 5);
	});

	it('publishes an agent', async () => {
		const ctx = createMockExecuteFunctions({ agentId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ status: 'published' });

		const result = await handleAgentOperation.call(ctx, 'publish', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', `/api/v1/agents/${VALID_UUID}/publish`);
	});

	it('updates an agent', async () => {
		const ctx = createMockExecuteFunctions({ agentId: VALID_UUID, updateFields: { name: 'Updated' } });
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID, name: 'Updated' });

		const result = await handleAgentOperation.call(ctx, 'update', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('PATCH', `/api/v1/agents/${VALID_UUID}`, { name: 'Updated' });
	});

	it('returns empty object for unknown operation', async () => {
		const ctx = createMockExecuteFunctions({});
		const result = await handleAgentOperation.call(ctx, 'unknown', 0);
		expect(result).toEqual({});
	});
});

// ─── Call Operations ─────────────────────────────────────

describe('handleCallOperation', () => {
	beforeEach(() => {
		mockBessApiRequest.mockReset();
		mockBessApiRequestAllItems.mockReset();
	});

	it('creates a phone call with valid agent ID', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			fromNumber: '+14155552671',
			toNumber: '+14155552672',
			additionalFields: {},
		});
		mockBessApiRequest.mockResolvedValue({ id: 'call-123' });

		await handleCallOperation.call(ctx, 'createPhoneCall', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/calls/phone', {
			agent_id: VALID_UUID,
			from_number: '+14155552671',
			to_number: '+14155552672',
		});
	});

	it('creates a phone call with metadata and dynamic variables', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			fromNumber: '+14155552671',
			toNumber: '+14155552672',
			additionalFields: {
				metadata: '{"source": "n8n"}',
				dynamic_variables: '{"name": "John"}',
			},
		});
		mockBessApiRequest.mockResolvedValue({ id: 'call-123' });

		await handleCallOperation.call(ctx, 'createPhoneCall', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/calls/phone', {
			agent_id: VALID_UUID,
			from_number: '+14155552671',
			to_number: '+14155552672',
			metadata: { source: 'n8n' },
			dynamic_variables: { name: 'John' },
		});
	});

	it('rejects phone call with invalid metadata JSON', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			fromNumber: '+14155552671',
			toNumber: '+14155552672',
			additionalFields: { metadata: '{bad json}' },
		});

		await expect(handleCallOperation.call(ctx, 'createPhoneCall', 0)).rejects.toThrow('Invalid JSON');
	});

	it('creates a web call', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			additionalFields: {},
		});
		mockBessApiRequest.mockResolvedValue({ id: 'web-call-123' });

		await handleCallOperation.call(ctx, 'createWebCall', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/calls/web', {
			agent_id: VALID_UUID,
		});
	});

	it('rejects web call with invalid agent UUID', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: 'not-valid',
			additionalFields: {},
		});
		await expect(handleCallOperation.call(ctx, 'createWebCall', 0)).rejects.toThrow('Invalid UUID');
	});

	it('ends a call', async () => {
		const ctx = createMockExecuteFunctions({ callId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ status: 'ended' });

		await handleCallOperation.call(ctx, 'end', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', `/api/v1/calls/${VALID_UUID}/end`);
	});

	it('gets a call', async () => {
		const ctx = createMockExecuteFunctions({ callId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID });

		await handleCallOperation.call(ctx, 'get', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', `/api/v1/calls/${VALID_UUID}`);
	});

	it('rejects get with invalid call ID', async () => {
		const ctx = createMockExecuteFunctions({ callId: 'bad' });
		await expect(handleCallOperation.call(ctx, 'get', 0)).rejects.toThrow('Invalid UUID');
	});

	it('gets many calls with filters', async () => {
		const ctx = createMockExecuteFunctions({
			returnAll: false,
			limit: 10,
			filters: { agent_id: VALID_UUID, status: 'ended' },
		});
		mockBessApiRequestAllItems.mockResolvedValue([]);

		await handleCallOperation.call(ctx, 'getMany', 0);
		expect(mockBessApiRequestAllItems).toHaveBeenCalledWith(
			'GET', '/api/v1/calls', {},
			{ agent_id: VALID_UUID, status: 'ended' },
			10,
		);
	});
});

// ─── Phone Number Operations ─────────────────────────────

describe('handlePhoneNumberOperation', () => {
	beforeEach(() => {
		mockBessApiRequest.mockReset();
		mockBessApiRequestAllItems.mockReset();
	});

	it('creates a phone number', async () => {
		const ctx = createMockExecuteFunctions({
			phoneNumber: '+14155552671',
			additionalFields: { friendly_name: 'Main' },
		});
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID });

		await handlePhoneNumberOperation.call(ctx, 'create', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/phone-numbers', {
			phone_number: '+14155552671',
			friendly_name: 'Main',
		});
	});

	it('deletes a phone number with valid UUID', async () => {
		const ctx = createMockExecuteFunctions({ phoneNumberId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({});

		const result = await handlePhoneNumberOperation.call(ctx, 'delete', 0);
		expect(result).toEqual({ success: true });
	});

	it('rejects delete with invalid phone number UUID', async () => {
		const ctx = createMockExecuteFunctions({ phoneNumberId: 'abc' });
		await expect(handlePhoneNumberOperation.call(ctx, 'delete', 0)).rejects.toThrow('Invalid UUID');
	});

	it('gets a phone number', async () => {
		const ctx = createMockExecuteFunctions({ phoneNumberId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID });

		await handlePhoneNumberOperation.call(ctx, 'get', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', `/api/v1/phone-numbers/${VALID_UUID}`);
	});

	it('updates a phone number', async () => {
		const ctx = createMockExecuteFunctions({
			phoneNumberId: VALID_UUID,
			updateFields: { friendly_name: 'Updated' },
		});
		mockBessApiRequest.mockResolvedValue({});

		await handlePhoneNumberOperation.call(ctx, 'update', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('PATCH', `/api/v1/phone-numbers/${VALID_UUID}`, { friendly_name: 'Updated' });
	});
});

// ─── Batch Call Operations ───────────────────────────────

describe('handleBatchCallOperation', () => {
	beforeEach(() => {
		mockBessApiRequest.mockReset();
		mockBessApiRequestAllItems.mockReset();
	});

	it('creates a batch call with valid contacts JSON', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			fromNumber: '+14155552671',
			contacts: '[{"phone_number": "+14155552672"}]',
			additionalFields: {},
		});
		mockBessApiRequest.mockResolvedValue({ id: 'batch-1' });

		await handleBatchCallOperation.call(ctx, 'create', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', '/api/v1/batch-calls', {
			agent_id: VALID_UUID,
			from_number: '+14155552671',
			contacts: [{ phone_number: '+14155552672' }],
		});
	});

	it('rejects batch create with invalid contacts JSON', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: VALID_UUID,
			fromNumber: '+14155552671',
			contacts: 'not json',
			additionalFields: {},
		});
		await expect(handleBatchCallOperation.call(ctx, 'create', 0)).rejects.toThrow('Invalid JSON');
	});

	it('rejects batch create with invalid agent UUID', async () => {
		const ctx = createMockExecuteFunctions({
			agentId: 'bad-id',
			fromNumber: '+14155552671',
			contacts: '[]',
			additionalFields: {},
		});
		await expect(handleBatchCallOperation.call(ctx, 'create', 0)).rejects.toThrow('Invalid UUID');
	});

	it('gets a batch call', async () => {
		const ctx = createMockExecuteFunctions({ batchCallId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ id: VALID_UUID });

		await handleBatchCallOperation.call(ctx, 'get', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', `/api/v1/batch-calls/${VALID_UUID}`);
	});

	it.each(['start', 'pause', 'resume', 'cancel'])('handles %s operation', async (op) => {
		const ctx = createMockExecuteFunctions({ batchCallId: VALID_UUID });
		mockBessApiRequest.mockResolvedValue({ status: op });

		await handleBatchCallOperation.call(ctx, op, 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('POST', `/api/v1/batch-calls/${VALID_UUID}/${op}`);
	});

	it.each(['start', 'pause', 'resume', 'cancel'])('rejects %s with invalid UUID', async (op) => {
		const ctx = createMockExecuteFunctions({ batchCallId: 'invalid' });
		await expect(handleBatchCallOperation.call(ctx, op, 0)).rejects.toThrow('Invalid UUID');
	});
});

// ─── Analytics Operations ────────────────────────────────

describe('handleAnalyticsOperation', () => {
	beforeEach(() => {
		mockBessApiRequest.mockReset();
	});

	it('gets summary with filters', async () => {
		const ctx = createMockExecuteFunctions({
			filters: { agent_id: VALID_UUID, from_date: '2024-01-01' },
		});
		mockBessApiRequest.mockResolvedValue({ total_calls: 100 });

		await handleAnalyticsOperation.call(ctx, 'getSummary', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', '/api/v1/analytics/summary', {},
			{ agent_id: VALID_UUID, from_date: '2024-01-01' });
	});

	it('gets calls by day', async () => {
		const ctx = createMockExecuteFunctions({
			filters: { days: 7 },
		});
		mockBessApiRequest.mockResolvedValue([]);

		await handleAnalyticsOperation.call(ctx, 'getCallsByDay', 0);
		expect(mockBessApiRequest).toHaveBeenCalledWith('GET', '/api/v1/analytics/calls-by-day', {},
			{ days: 7 });
	});
});
