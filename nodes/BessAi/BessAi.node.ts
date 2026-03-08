import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { bessApiRequest } from './GenericFunctions';

import { agentOperations, agentFields } from './AgentDescription';
import { callOperations, callFields } from './CallDescription';
import { phoneNumberOperations, phoneNumberFields } from './PhoneNumberDescription';
import { batchCallOperations, batchCallFields } from './BatchCallDescription';
import { analyticsOperations, analyticsFields } from './AnalyticsDescription';
import {
	handleAgentOperation,
	handleCallOperation,
	handlePhoneNumberOperation,
	handleBatchCallOperation,
	handleAnalyticsOperation,
} from './ResourceHelpers';

export class BessAi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BESS AI',
		name: 'bessAi',
		icon: 'file:bessai.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the BESS AI Call Center API',
		defaults: {
			name: 'BESS AI',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'bessAiApi',
				required: true,
			},
		],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Agent', value: 'agent' },
					{ name: 'Analytics', value: 'analytics' },
					{ name: 'Batch Call', value: 'batchCall' },
					{ name: 'Call', value: 'call' },
					{ name: 'Phone Number', value: 'phoneNumber' },
				],
				default: 'agent',
			},
			...agentOperations,
			...agentFields,
			...callOperations,
			...callFields,
			...phoneNumberOperations,
			...phoneNumberFields,
			...batchCallOperations,
			...batchCallFields,
			...analyticsOperations,
			...analyticsFields,
		],
	};

	methods = {
		loadOptions: {
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const agents = await bessApiRequest.call(this, 'GET', '/api/v1/agents');
				if (!Array.isArray(agents)) return [];
				return agents.map((agent: any) => ({
					name: agent.name || agent.id,
					value: agent.id,
				}));
			},
			async getPhoneNumbers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const numbers = await bessApiRequest.call(this, 'GET', '/api/v1/phone-numbers');
				if (!Array.isArray(numbers)) return [];
				return numbers.map((num: any) => ({
					name: num.phone_number || num.id,
					value: num.id,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				if (resource === 'agent') {
					responseData = await handleAgentOperation.call(this, operation, i);
				} else if (resource === 'call') {
					responseData = await handleCallOperation.call(this, operation, i);
				} else if (resource === 'phoneNumber') {
					responseData = await handlePhoneNumberOperation.call(this, operation, i);
				} else if (resource === 'batchCall') {
					responseData = await handleBatchCallOperation.call(this, operation, i);
				} else if (resource === 'analytics') {
					responseData = await handleAnalyticsOperation.call(this, operation, i);
				}

				if (Array.isArray(responseData)) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				} else if (responseData !== undefined) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
