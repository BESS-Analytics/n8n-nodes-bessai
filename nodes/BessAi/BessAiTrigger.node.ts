import type {
	INodeType,
	INodeTypeDescription,
	IPollFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { bessApiRequest } from './GenericFunctions';

export class BessAiTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BESS AI Trigger',
		name: 'bessAiTrigger',
		icon: 'file:bessai.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{"Watch " + $parameter["event"]}}',
		description: 'Triggers when new calls or batch calls are detected',
		defaults: {
			name: 'BESS AI Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'bessAiApi',
				required: true,
			},
		],
		polling: true,
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'New Call Completed',
						value: 'callCompleted',
						description: 'Triggers when a call is completed',
					},
					{
						name: 'New Batch Call Status Change',
						value: 'batchCallStatusChange',
						description: 'Triggers when a batch call status changes',
					},
				],
				default: 'callCompleted',
				required: true,
			},
			{
				displayName: 'Agent ID',
				name: 'agentId',
				type: 'string',
				default: '',
				description: 'Filter by agent ID (leave empty for all agents)',
			},
		],
	};

	async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
		const event = this.getNodeParameter('event') as string;
		const agentId = this.getNodeParameter('agentId') as string;
		const staticData = this.getWorkflowStaticData('node');
		const now = new Date().toISOString();

		if (event === 'callCompleted') {
			const lastPoll = (staticData.lastPollTime as string) || now;
			staticData.lastPollTime = now;

			const qs: IDataObject = {
				status: 'ended',
				from_date: lastPoll,
				limit: 100,
			};
			if (agentId) qs.agent_id = agentId;

			const calls = await bessApiRequest.call(this, 'GET', '/api/v1/calls', {}, qs);

			if (!Array.isArray(calls) || calls.length === 0) {
				return null;
			}

			return [this.helpers.returnJsonArray(calls)];
		}

		if (event === 'batchCallStatusChange') {
			const lastKnownStatuses = (staticData.batchStatuses as IDataObject) || {};
			staticData.lastPollTime = now;

			const batches = await bessApiRequest.call(this, 'GET', '/api/v1/batch-calls', {}, {
				limit: 50,
			});

			if (!Array.isArray(batches) || batches.length === 0) {
				return null;
			}

			const changed: any[] = [];
			const newStatuses: IDataObject = {};

			for (const batch of batches) {
				const id = batch.id as string;
				const status = batch.status as string;
				newStatuses[id] = status;

				if (lastKnownStatuses[id] !== undefined && lastKnownStatuses[id] !== status) {
					changed.push({
						...batch,
						previous_status: lastKnownStatuses[id],
					});
				}
			}

			staticData.batchStatuses = newStatuses;

			if (changed.length === 0) {
				return null;
			}

			return [this.helpers.returnJsonArray(changed)];
		}

		return null;
	}
}
