import type { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new agent',
				action: 'Create an agent',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an agent',
				action: 'Delete an agent',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get an agent by ID',
				action: 'Get an agent',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many agents',
				action: 'Get many agents',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish an agent',
				action: 'Publish an agent',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an agent',
				action: 'Update an agent',
			},
		],
		default: 'getMany',
	},
];

export const agentFields: INodeProperties[] = [
	// ----------------------------------
	//         agent: create
	// ----------------------------------
	{
		displayName: 'Agent Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		description: 'The name of the agent',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Agent Mode',
				name: 'agent_mode',
				type: 'options',
				options: [
					{ name: 'Single Prompt', value: 'single_prompt' },
					{ name: 'Conversation Flow', value: 'conversation_flow' },
				],
				default: 'single_prompt',
			},
			{
				displayName: 'Agent Type',
				name: 'agent_type',
				type: 'string',
				default: 'orchestration_agent',
			},
			{
				displayName: 'Background Sound',
				name: 'background_sound',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'End Call After Silence (Ms)',
				name: 'end_call_after_silence_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Endpointing (Ms)',
				name: 'endpointing_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Interruption Sensitivity',
				name: 'interruption_sensitivity',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1 },
				default: 0.5,
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Language code (e.g. en, tr, de)',
			},
			{
				displayName: 'LLM Model',
				name: 'llm_model',
				type: 'string',
				default: 'llama-3.3-70b-versatile',
			},
			{
				displayName: 'LLM Provider',
				name: 'llm_provider',
				type: 'string',
				default: 'groq',
			},
			{
				displayName: 'Max Call Duration (Ms)',
				name: 'max_call_duration_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Max Completion Tokens',
				name: 'max_completion_tokens',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 8192 },
				default: 1024,
			},
			{
				displayName: 'Reminder Max Count',
				name: 'reminder_max_count',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Reminder Trigger (Ms)',
				name: 'reminder_trigger_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Responsiveness',
				name: 'responsiveness',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'STT Model',
				name: 'stt_model',
				type: 'string',
				default: 'nova-2',
			},
			{
				displayName: 'STT Provider',
				name: 'stt_provider',
				type: 'string',
				default: 'deepgram',
			},
			{
				displayName: 'System Prompt',
				name: 'system_prompt',
				type: 'string',
				typeOptions: { rows: 6 },
				default: 'You are a helpful AI assistant.',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2 },
				default: 0.7,
			},
			{
				displayName: 'Voice ID',
				name: 'voice_id',
				type: 'string',
				default: '21m00Tcm4TlvDq8ikWAM',
			},
			{
				displayName: 'Voice Provider',
				name: 'voice_provider',
				type: 'string',
				default: 'elevenlabs',
			},
			{
				displayName: 'Voice Speed',
				name: 'voice_speed',
				type: 'number',
				typeOptions: { minValue: 0.5, maxValue: 2 },
				default: 1,
			},
			{
				displayName: 'Voice Stability',
				name: 'voice_stability',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1 },
				default: 0.5,
			},
			{
				displayName: 'Webhook URL',
				name: 'webhook_url',
				type: 'string',
				default: '',
			},
		],
	},

	// ----------------------------------
	//         agent: delete
	// ----------------------------------
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['delete'],
			},
		},
		description: 'The ID of the agent to delete',
	},

	// ----------------------------------
	//         agent: get
	// ----------------------------------
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['get'],
			},
		},
		description: 'The ID of the agent to retrieve',
	},

	// ----------------------------------
	//         agent: getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['agent'],
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
				resource: ['agent'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ----------------------------------
	//         agent: publish
	// ----------------------------------
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['publish'],
			},
		},
		description: 'The ID of the agent to publish',
	},

	// ----------------------------------
	//         agent: update
	// ----------------------------------
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['update'],
			},
		},
		description: 'The ID of the agent to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Agent Mode',
				name: 'agent_mode',
				type: 'options',
				options: [
					{ name: 'Single Prompt', value: 'single_prompt' },
					{ name: 'Conversation Flow', value: 'conversation_flow' },
				],
				default: 'single_prompt',
			},
			{
				displayName: 'Background Sound',
				name: 'background_sound',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: 'End Call After Silence (Ms)',
				name: 'end_call_after_silence_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Endpointing (Ms)',
				name: 'endpointing_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Interruption Sensitivity',
				name: 'interruption_sensitivity',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1 },
				default: 0.5,
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
			},
			{
				displayName: 'LLM Model',
				name: 'llm_model',
				type: 'string',
				default: '',
			},
			{
				displayName: 'LLM Provider',
				name: 'llm_provider',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Max Call Duration (Ms)',
				name: 'max_call_duration_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Max Completion Tokens',
				name: 'max_completion_tokens',
				type: 'number',
				typeOptions: { minValue: 1, maxValue: 8192 },
				default: 1024,
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Reminder Max Count',
				name: 'reminder_max_count',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Reminder Trigger (Ms)',
				name: 'reminder_trigger_ms',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Responsiveness',
				name: 'responsiveness',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'STT Model',
				name: 'stt_model',
				type: 'string',
				default: '',
			},
			{
				displayName: 'STT Provider',
				name: 'stt_provider',
				type: 'string',
				default: '',
			},
			{
				displayName: 'System Prompt',
				name: 'system_prompt',
				type: 'string',
				typeOptions: { rows: 6 },
				default: '',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 2 },
				default: 0.7,
			},
			{
				displayName: 'Voice ID',
				name: 'voice_id',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Voice Provider',
				name: 'voice_provider',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Voice Speed',
				name: 'voice_speed',
				type: 'number',
				typeOptions: { minValue: 0.5, maxValue: 2 },
				default: 1,
			},
			{
				displayName: 'Voice Stability',
				name: 'voice_stability',
				type: 'number',
				typeOptions: { minValue: 0, maxValue: 1 },
				default: 0.5,
			},
			{
				displayName: 'Webhook URL',
				name: 'webhook_url',
				type: 'string',
				default: '',
			},
		],
	},
];
