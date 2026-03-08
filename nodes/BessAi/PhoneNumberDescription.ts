import type { INodeProperties } from 'n8n-workflow';

export const phoneNumberOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Register a phone number',
				action: 'Create a phone number',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a phone number',
				action: 'Delete a phone number',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a phone number by ID',
				action: 'Get a phone number',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many phone numbers',
				action: 'Get many phone numbers',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a phone number',
				action: 'Update a phone number',
			},
		],
		default: 'getMany',
	},
];

export const phoneNumberFields: INodeProperties[] = [
	// ----------------------------------
	//         phoneNumber: create
	// ----------------------------------
	{
		displayName: 'Phone Number',
		name: 'phoneNumber',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['create'],
			},
		},
		description: 'The phone number to register (E.164 format)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Inbound Agent ID',
				name: 'inbound_agent_id',
				type: 'string',
				default: '',
				description: 'Agent ID to handle inbound calls',
			},
			{
				displayName: 'Inbound Webhook URL',
				name: 'inbound_webhook_url',
				type: 'string',
				default: '',
				description: 'Webhook URL for inbound call notifications',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
				description: 'A friendly name for the phone number',
			},
			{
				displayName: 'Outbound Agent ID',
				name: 'outbound_agent_id',
				type: 'string',
				default: '',
				description: 'Agent ID to handle outbound calls',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'string',
				default: 'custom',
				description: 'The telephony provider',
			},
		],
	},

	// ----------------------------------
	//         phoneNumber: delete
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the phone number to delete',
	},

	// ----------------------------------
	//         phoneNumber: get
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['get'],
			},
		},
		description: 'The ID of the phone number to retrieve',
	},

	// ----------------------------------
	//         phoneNumber: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
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
		default: 50,
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         phoneNumber: update
	// ----------------------------------
	{
		displayName: 'Phone Number ID',
		name: 'phoneNumberId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['update'],
			},
		},
		description: 'The ID of the phone number to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['phoneNumber'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Inbound Agent ID',
				name: 'inbound_agent_id',
				type: 'string',
				default: '',
				description: 'Agent ID to handle inbound calls',
			},
			{
				displayName: 'Inbound Webhook URL',
				name: 'inbound_webhook_url',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Nickname',
				name: 'nickname',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Outbound Agent ID',
				name: 'outbound_agent_id',
				type: 'string',
				default: '',
				description: 'Agent ID to handle outbound calls',
			},
		],
	},
];
