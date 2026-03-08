import { BessAi } from '../nodes/BessAi/BessAi.node';
import { BessAiTrigger } from '../nodes/BessAi/BessAiTrigger.node';

// ─── Node Definition Tests ───────────────────────────────

describe('BessAi Node', () => {
	const node = new BessAi();

	it('has correct name and type', () => {
		expect(node.description.name).toBe('bessAi');
		expect(node.description.displayName).toBe('BESS AI');
	});

	it('has required credential configured', () => {
		expect(node.description.credentials).toEqual([
			{ name: 'bessAiApi', required: true },
		]);
	});

	it('is usable as a tool (AI agent compatible)', () => {
		expect(node.description.usableAsTool).toBe(true);
	});

	it('has all 5 resources', () => {
		const resourceProp = node.description.properties.find(p => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		const options = (resourceProp as any).options.map((o: any) => o.value);
		expect(options).toEqual(expect.arrayContaining(['agent', 'analytics', 'batchCall', 'call', 'phoneNumber']));
		expect(options).toHaveLength(5);
	});

	it('has main input and output', () => {
		expect(node.description.inputs).toEqual(['main']);
		expect(node.description.outputs).toEqual(['main']);
	});

	it('has subtitle template', () => {
		expect(node.description.subtitle).toContain('operation');
		expect(node.description.subtitle).toContain('resource');
	});

	it('has loadOptions methods', () => {
		expect(node.methods).toBeDefined();
		expect(node.methods!.loadOptions).toBeDefined();
		expect(node.methods!.loadOptions!.getAgents).toBeDefined();
		expect(node.methods!.loadOptions!.getPhoneNumbers).toBeDefined();
	});
});

describe('BessAiTrigger Node', () => {
	const node = new BessAiTrigger();

	it('has correct name and type', () => {
		expect(node.description.name).toBe('bessAiTrigger');
		expect(node.description.displayName).toBe('BESS AI Trigger');
	});

	it('is configured for polling', () => {
		expect(node.description.polling).toBe(true);
	});

	it('has required credential configured', () => {
		expect(node.description.credentials).toEqual([
			{ name: 'bessAiApi', required: true },
		]);
	});

	it('has trigger-specific inputs/outputs', () => {
		expect(node.description.inputs).toEqual([]);
		expect(node.description.outputs).toEqual(['main']);
		expect(node.description.group).toEqual(['trigger']);
	});

	it('has event options for callCompleted and batchCallStatusChange', () => {
		const eventProp = node.description.properties.find(p => p.name === 'event');
		expect(eventProp).toBeDefined();
		const values = (eventProp as any).options.map((o: any) => o.value);
		expect(values).toEqual(expect.arrayContaining(['callCompleted', 'batchCallStatusChange']));
	});

	it('has agentId filter parameter', () => {
		const agentIdProp = node.description.properties.find(p => p.name === 'agentId');
		expect(agentIdProp).toBeDefined();
		expect(agentIdProp!.default).toBe('');
	});
});

// ─── Description Field Validation ────────────────────────

describe('Description fields use loadOptions', () => {
	const node = new BessAi();
	const allProps = node.description.properties;

	function findFields(name: string) {
		return allProps.filter(p => p.name === name);
	}

	it('agent resource agentId fields use loadOptionsMethod', () => {
		const agentIdFields = findFields('agentId').filter(
			p => p.displayOptions?.show?.resource?.includes('agent'),
		);
		expect(agentIdFields.length).toBeGreaterThan(0);
		for (const field of agentIdFields) {
			expect(field.type).toBe('options');
			expect((field as any).typeOptions?.loadOptionsMethod).toBe('getAgents');
		}
	});

	it('call resource agentId fields use loadOptionsMethod', () => {
		const callAgentFields = findFields('agentId').filter(
			p => p.displayOptions?.show?.resource?.includes('call'),
		);
		expect(callAgentFields.length).toBeGreaterThan(0);
		for (const field of callAgentFields) {
			expect(field.type).toBe('options');
			expect((field as any).typeOptions?.loadOptionsMethod).toBe('getAgents');
		}
	});

	it('batchCall resource agentId field uses loadOptionsMethod', () => {
		const batchAgentFields = findFields('agentId').filter(
			p => p.displayOptions?.show?.resource?.includes('batchCall'),
		);
		expect(batchAgentFields).toHaveLength(1);
		expect(batchAgentFields[0].type).toBe('options');
		expect((batchAgentFields[0] as any).typeOptions?.loadOptionsMethod).toBe('getAgents');
	});

	it('phoneNumberId fields use loadOptionsMethod', () => {
		const phoneFields = findFields('phoneNumberId');
		expect(phoneFields.length).toBeGreaterThan(0);
		for (const field of phoneFields) {
			expect(field.type).toBe('options');
			expect((field as any).typeOptions?.loadOptionsMethod).toBe('getPhoneNumbers');
		}
	});
});
