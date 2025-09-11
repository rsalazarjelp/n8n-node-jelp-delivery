import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderOverflowOptions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Order overflow options',
		name: 'orderOverflowOptions',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'List overflow options for an order and info needed like providers that can deliver it, workspacePartnership, partnership of each provider, and quote for each provider',
		defaults: {
			name: 'Order Overflow Options',
		},
		inputs: [NodeConnectionType.Main, NodeConnectionType.AiTool],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'jelpDeliveryApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Public ID',
				name: 'publicId',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const url = `${BASE_URL}/api/v1/order/${this.getNodeParameter('publicId', i)}/providers/quote`;

			const options = {
				method: 'GET' as const,
				url,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			};

			const response = await this.helpers.requestWithAuthentication.call(this, 'jelpDeliveryApi', options);

			let data;
			if (typeof response === 'string') {
				data = JSON.parse(response);
			} else {
				data = response;
			}

			returnData.push({
				json: data,
			});
		}

		return [returnData];
	}
}
