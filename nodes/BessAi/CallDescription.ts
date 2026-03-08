import type { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['call'],
			},
		},
		options: [
			{
				name: 'Create Phone Call',
				value: 'createPhoneCall',
				description: 'Create and initiate a phone call',
				action: 'Create a phone call',
			},
			{
				name: 'Create Web Call',
				value: 'createWebCall',
				description: 'Create a web call session',
				action: 'Create a web call',
			},
			{
				name: 'End Call',
				value: 'end',
				description: 'End an active call',
				action: 'End a call',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a call by ID',
				action: 'Get a call',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many calls',
				action: 'Get many calls',
			},
		],
		default: 'getMany',
	},
];

export const callFields: INodeProperties[] = [
	// ----------------------------------
	//         call: createPhoneCall
	// ----------------------------------
	{
		displayName: 'Agent',
		name: 'agentId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		description: 'The agent to use for the call. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'From Number',
		name: 'fromNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		description: 'The phone number to call from (E.164 format, e.g. +14155552671)',
	},
	{
		displayName: 'To Number',
		name: 'toNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		description: 'The phone number to call (E.164 format, e.g. +14155552671)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createPhoneCall'],
			},
		},
		options: [
			{
				displayName: 'Dynamic Variables',
				name: 'dynamic_variables',
				type: 'json',
				default: '{}',
				description: 'Key-value pairs of dynamic variables for the call',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata to attach to the call',
			},
		],
	},

	// ----------------------------------
	//         call: createWebCall
	// ----------------------------------
	{
		displayName: 'Agent',
		name: 'agentId',
		type: 'options',
		required: true,
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebCall'],
			},
		},
		description: 'The agent to use for the web call. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebCall'],
			},
		},
		options: [
			{
				displayName: 'Dynamic Variables',
				name: 'dynamic_variables',
				type: 'json',
				default: '{}',
				description: 'Key-value pairs of dynamic variables for the call',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom metadata to attach to the call',
			},
		],
	},

	// ----------------------------------
	//         call: end
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['end'],
			},
		},
		description: 'The ID of the call to end',
	},

	// ----------------------------------
	//         call: get
	// ----------------------------------
	{
		displayName: 'Call ID',
		name: 'callId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['get'],
			},
		},
		description: 'The ID of the call to retrieve',
	},

	// ----------------------------------
	//         call: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['call'],
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
				resource: ['call'],
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
				resource: ['call'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Agent ID',
				name: 'agent_id',
				type: 'string',
				default: '',
				description: 'Filter calls by agent ID',
			},
			{
				displayName: 'Batch Call ID',
				name: 'batch_call_id',
				type: 'string',
				default: '',
				description: 'Filter calls by batch call ID',
			},
			{
				displayName: 'Call Type',
				name: 'call_type',
				type: 'options',
				options: [
					{ name: 'Phone', value: 'phone' },
					{ name: 'Web', value: 'web' },
				],
				default: 'phone',
			},
			{
				displayName: 'From Date',
				name: 'from_date',
				type: 'dateTime',
				default: '',
				description: 'Filter calls from this date (ISO 8601)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Ended', value: 'ended' },
					{ name: 'Error', value: 'error' },
					{ name: 'Initiated', value: 'initiated' },
				],
				default: 'completed',
			},
			{
				displayName: 'To Date',
				name: 'to_date',
				type: 'dateTime',
				default: '',
				description: 'Filter calls up to this date (ISO 8601)',
			},
		],
	},
];
