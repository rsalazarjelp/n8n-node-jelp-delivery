import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderOverflowOptions implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Order overflow options',
		name: 'orderOverflowOptions',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Options for order overflow from Jelp Delivery',
		defaults: {
			name: 'Order Overflow Options',
		},
		inputs: [NodeConnectionType.Main],
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
				displayName: 'Public Id',
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
