import type { INodeProperties } from 'n8n-workflow';

export const batchCallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['batchCall'],
			},
		},
		options: [
			{
				name: 'Cancel',
				value: 'cancel',
				description: 'Cancel a batch call',
				action: 'Cancel a batch call',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new batch call',
				action: 'Create a batch call',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a batch call by ID',
				action: 'Get a batch call',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many batch calls',
				action: 'Get many batch calls',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a running batch call',
				action: 'Pause a batch call',
			},
			{
				name: 'Resume',
				value: 'resume',
				description: 'Resume a paused batch call',
				action: 'Resume a batch call',
			},
			{
				name: 'Start',
				value: 'start',
				description: 'Start a created batch call',
				action: 'Start a batch call',
			},
		],
		default: 'getMany',
	},
];

export const batchCallFields: INodeProperties[] = [
	// ----------------------------------
	//         batchCall: create
	// ----------------------------------
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['create'],
			},
		},
		description: 'The ID of the agent to use for the batch',
	},
	{
		displayName: 'From Number',
		name: 'fromNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['create'],
			},
		},
		description: 'The phone number to call from (E.164 format)',
	},
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'json',
		required: true,
		default: '[{"phone_number": "+14155552671"}]',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['create'],
			},
		},
		description: 'Array of contacts. Each contact must have a "phone_number" field and optionally "dynamic_variables".',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Max Concurrent Calls',
				name: 'max_concurrent_calls',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 100 },
				default: 5,
				description: 'Maximum number of concurrent calls in the batch',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'A name for the batch call',
			},
			{
				displayName: 'Retry Attempts',
				name: 'retry_attempts',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 5 },
				default: 1,
				description: 'Number of retry attempts for failed calls',
			},
		],
	},

	// ----------------------------------
	//         batchCall: get
	// ----------------------------------
	{
		displayName: 'Batch Call ID',
		name: 'batchCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['get'],
			},
		},
		description: 'The ID of the batch call to retrieve',
	},

	// ----------------------------------
	//         batchCall: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 20,
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Cancelled', value: 'cancelled' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Created', value: 'created' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Running', value: 'running' },
				],
				default: 'created',
				description: 'Filter by batch status',
			},
		],
	},

	// ----------------------------------
	//         batchCall: start
	// ----------------------------------
	{
		displayName: 'Batch Call ID',
		name: 'batchCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['start'],
			},
		},
		description: 'The ID of the batch call to start',
	},

	// ----------------------------------
	//         batchCall: pause
	// ----------------------------------
	{
		displayName: 'Batch Call ID',
		name: 'batchCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['pause'],
			},
		},
		description: 'The ID of the batch call to pause',
	},

	// ----------------------------------
	//         batchCall: resume
	// ----------------------------------
	{
		displayName: 'Batch Call ID',
		name: 'batchCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['resume'],
			},
		},
		description: 'The ID of the batch call to resume',
	},

	// ----------------------------------
	//         batchCall: cancel
	// ----------------------------------
	{
		displayName: 'Batch Call ID',
		name: 'batchCallId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['batchCall'],
				operation: ['cancel'],
			},
		},
		description: 'The ID of the batch call to cancel',
	},
];
