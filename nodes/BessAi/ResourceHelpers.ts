import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { bessApiRequest, bessApiRequestAllItems } from './GenericFunctions';

// ─── Agent ───────────────────────────────────────────────

export async function handleAgentOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'create') {
		const name = this.getNodeParameter('name', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		const body: IDataObject = { name, ...additionalFields };
		return bessApiRequest.call(this, 'POST', '/api/v1/agents', body);
	}

	if (operation === 'delete') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		await bessApiRequest.call(this, 'DELETE', `/api/v1/agents/${agentId}`);
		return { success: true };
	}

	if (operation === 'get') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		return bessApiRequest.call(this, 'GET', `/api/v1/agents/${agentId}`);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return bessApiRequestAllItems.call(this, 'GET', '/api/v1/agents');
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return bessApiRequestAllItems.call(this, 'GET', '/api/v1/agents', {}, {}, limit);
	}

	if (operation === 'publish') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/agents/${agentId}/publish`);
	}

	if (operation === 'update') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		return bessApiRequest.call(this, 'PATCH', `/api/v1/agents/${agentId}`, updateFields);
	}

	return {};
}

// ─── Call ────────────────────────────────────────────────

export async function handleCallOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'createPhoneCall') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const fromNumber = this.getNodeParameter('fromNumber', i) as string;
		const toNumber = this.getNodeParameter('toNumber', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = {
			agent_id: agentId,
			from_number: fromNumber,
			to_number: toNumber,
		};

		if (additionalFields.metadata) {
			body.metadata = JSON.parse(additionalFields.metadata as string);
		}
		if (additionalFields.dynamic_variables) {
			body.dynamic_variables = JSON.parse(additionalFields.dynamic_variables as string);
		}

		return bessApiRequest.call(this, 'POST', '/api/v1/calls/phone', body);
	}

	if (operation === 'createWebCall') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const body: IDataObject = { agent_id: agentId };

		if (additionalFields.metadata) {
			body.metadata = JSON.parse(additionalFields.metadata as string);
		}
		if (additionalFields.dynamic_variables) {
			body.dynamic_variables = JSON.parse(additionalFields.dynamic_variables as string);
		}

		return bessApiRequest.call(this, 'POST', '/api/v1/calls/web', body);
	}

	if (operation === 'end') {
		const callId = this.getNodeParameter('callId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/calls/${callId}/end`);
	}

	if (operation === 'get') {
		const callId = this.getNodeParameter('callId', i) as string;
		return bessApiRequest.call(this, 'GET', `/api/v1/calls/${callId}`);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const qs: IDataObject = {};

		if (filters.agent_id) qs.agent_id = filters.agent_id;
		if (filters.status) qs.status = filters.status;
		if (filters.call_type) qs.call_type = filters.call_type;
		if (filters.batch_call_id) qs.batch_call_id = filters.batch_call_id;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;

		if (returnAll) {
			return bessApiRequestAllItems.call(this, 'GET', '/api/v1/calls', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return bessApiRequestAllItems.call(this, 'GET', '/api/v1/calls', {}, qs, limit);
	}

	return {};
}

// ─── Phone Number ────────────────────────────────────────

export async function handlePhoneNumberOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'create') {
		const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		const body: IDataObject = { phone_number: phoneNumber, ...additionalFields };
		return bessApiRequest.call(this, 'POST', '/api/v1/phone-numbers', body);
	}

	if (operation === 'delete') {
		const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
		await bessApiRequest.call(this, 'DELETE', `/api/v1/phone-numbers/${phoneNumberId}`);
		return { success: true };
	}

	if (operation === 'get') {
		const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
		return bessApiRequest.call(this, 'GET', `/api/v1/phone-numbers/${phoneNumberId}`);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		if (returnAll) {
			return bessApiRequestAllItems.call(this, 'GET', '/api/v1/phone-numbers');
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return bessApiRequestAllItems.call(this, 'GET', '/api/v1/phone-numbers', {}, {}, limit);
	}

	if (operation === 'update') {
		const phoneNumberId = this.getNodeParameter('phoneNumberId', i) as string;
		const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
		return bessApiRequest.call(
			this,
			'PATCH',
			`/api/v1/phone-numbers/${phoneNumberId}`,
			updateFields,
		);
	}

	return {};
}

// ─── Batch Call ──────────────────────────────────────────

export async function handleBatchCallOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'create') {
		const agentId = this.getNodeParameter('agentId', i) as string;
		const fromNumber = this.getNodeParameter('fromNumber', i) as string;
		const contactsRaw = this.getNodeParameter('contacts', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

		const contacts = JSON.parse(contactsRaw);
		const body: IDataObject = {
			agent_id: agentId,
			from_number: fromNumber,
			contacts,
			...additionalFields,
		};

		return bessApiRequest.call(this, 'POST', '/api/v1/batch-calls', body);
	}

	if (operation === 'get') {
		const batchCallId = this.getNodeParameter('batchCallId', i) as string;
		return bessApiRequest.call(this, 'GET', `/api/v1/batch-calls/${batchCallId}`);
	}

	if (operation === 'getMany') {
		const returnAll = this.getNodeParameter('returnAll', i) as boolean;
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const qs: IDataObject = {};

		if (filters.status) qs.status = filters.status;

		if (returnAll) {
			return bessApiRequestAllItems.call(this, 'GET', '/api/v1/batch-calls', {}, qs);
		}
		const limit = this.getNodeParameter('limit', i) as number;
		return bessApiRequestAllItems.call(this, 'GET', '/api/v1/batch-calls', {}, qs, limit);
	}

	if (operation === 'start') {
		const batchCallId = this.getNodeParameter('batchCallId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/batch-calls/${batchCallId}/start`);
	}

	if (operation === 'pause') {
		const batchCallId = this.getNodeParameter('batchCallId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/batch-calls/${batchCallId}/pause`);
	}

	if (operation === 'resume') {
		const batchCallId = this.getNodeParameter('batchCallId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/batch-calls/${batchCallId}/resume`);
	}

	if (operation === 'cancel') {
		const batchCallId = this.getNodeParameter('batchCallId', i) as string;
		return bessApiRequest.call(this, 'POST', `/api/v1/batch-calls/${batchCallId}/cancel`);
	}

	return {};
}

// ─── Analytics ───────────────────────────────────────────

export async function handleAnalyticsOperation(
	this: IExecuteFunctions,
	operation: string,
	i: number,
): Promise<any> {
	if (operation === 'getSummary') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const qs: IDataObject = {};

		if (filters.agent_id) qs.agent_id = filters.agent_id;
		if (filters.from_date) qs.from_date = filters.from_date;
		if (filters.to_date) qs.to_date = filters.to_date;

		return bessApiRequest.call(this, 'GET', '/api/v1/analytics/summary', {}, qs);
	}

	if (operation === 'getCallsByDay') {
		const filters = this.getNodeParameter('filters', i) as IDataObject;
		const qs: IDataObject = {};

		if (filters.agent_id) qs.agent_id = filters.agent_id;
		if (filters.days) qs.days = filters.days;

		return bessApiRequest.call(this, 'GET', '/api/v1/analytics/calls-by-day', {}, qs);
	}

	return {};
}
