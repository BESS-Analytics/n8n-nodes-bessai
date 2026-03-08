import type { INodeProperties } from 'n8n-workflow';

export const analyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{
				name: 'Get Calls by Day',
				value: 'getCallsByDay',
				description: 'Get call counts grouped by day',
				action: 'Get calls by day',
			},
			{
				name: 'Get Summary',
				value: 'getSummary',
				description: 'Get analytics summary for calls',
				action: 'Get analytics summary',
			},
		],
		default: 'getSummary',
	},
];

export const analyticsFields: INodeProperties[] = [
	// ----------------------------------
	//         analytics: getSummary
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getSummary'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter analytics by agent ID',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Start date for the analytics period (ISO 8601)',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'End date for the analytics period (ISO 8601)',
			},
		],
	},

	// ----------------------------------
	//         analytics: getCallsByDay
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getCallsByDay'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter analytics by agent ID',
			},
			{
				displayName: 'Days',
				name: 'days',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 90 },
				default: 30,
				description: 'Number of days to look back',
			},
		],
	},
];
