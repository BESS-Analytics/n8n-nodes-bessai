import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IPollFunctions,
	IHttpRequestMethods,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

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
