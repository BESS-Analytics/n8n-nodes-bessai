import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IHttpRequestMethods,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates that a string is a valid UUID v4 format.
 * Prevents path traversal / injection in URL path parameters.
 */
export function validateUUID(
	context: IExecuteFunctions | IPollFunctions,
	value: string,
	fieldName: string,
): string {
	const trimmed = value.trim();
	if (!UUID_REGEX.test(trimmed)) {
		throw new NodeOperationError(context.getNode(), `Invalid UUID for "${fieldName}": ${value}`);
	}
	return trimmed;
}

/**
 * Safely parses a JSON string, throwing a user-friendly error on failure.
 */
export function safeJsonParse(
	context: IExecuteFunctions,
	value: string,
	fieldName: string,
): any {
	try {
		return JSON.parse(value);
	} catch {
		throw new NodeOperationError(
			context.getNode(),
			`Invalid JSON in "${fieldName}" field. Please check the format.`,
		);
	}
}

export async function bessApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IPollFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('bessAiApi');
	const baseUrl = (credentials.baseUrl as string) || 'https://api.bess-ai.com';

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'bessAiApi', {
			method,
			url: `${baseUrl}${endpoint}`,
			qs: Object.keys(qs).length > 0 ? qs : undefined,
			body: Object.keys(body).length > 0 ? body : undefined,
			json: true,
		});
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function bessApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	limit?: number,
): Promise<any[]> {
	const results: any[] = [];
	qs.skip = 0;
	qs.limit = 50;

	let responseData: any[];
	do {
		responseData = await bessApiRequest.call(this, method, endpoint, body, qs);
		if (!Array.isArray(responseData)) {
			return responseData;
		}
		results.push(...responseData);
		qs.skip = (qs.skip as number) + responseData.length;

		if (limit && results.length >= limit) {
			return results.slice(0, limit);
		}
	} while (responseData.length === (qs.limit as number));

	return results;
}
