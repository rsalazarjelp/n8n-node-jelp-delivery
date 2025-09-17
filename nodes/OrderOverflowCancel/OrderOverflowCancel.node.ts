import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderOverflowCancel implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cancel order overflow',
		name: 'orderOverflowCancel',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Cancel overflow of an order in Jelp Delivery, needs public ID',
		defaults: {
			name: 'Cancel Order Overflow',
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
				displayName: 'Public ID',
				name: 'order',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const url = `${BASE_URL}/api/v1/workspace-partnership/services/overflow/cancel`;

				const orderData = {
					order: this.getNodeParameter('order', i),
				};
				const options = {
					method: 'POST' as const,
					url,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: orderData,
				};

				const response = await this.helpers.requestWithAuthentication.call(
					this,
					'jelpDeliveryApi',
					options,
				);

				let data;
				if (typeof response === 'string') {
					data = JSON.parse(response);
				} else {
					data = response;
				}

				returnData.push({ json: data });
			} catch (error) {
				returnData.push({
					json: { error: error.message || error },
					error,
				});
			}
		}

		return [returnData];
	}
}
