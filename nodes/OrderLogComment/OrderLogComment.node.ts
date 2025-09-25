import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderLogComment implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Order Log Comment',
		name: 'orderLogComment',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Add a log comment to an order in Jelp Delivery, needs folio and comment',
		defaults: {
			name: ' Order Log Comment',
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
				displayName: 'Folio',
				name: 'folio',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		try {
			for (let i = 0; i < items.length; i++) {
				const url = `${BASE_URL}/api/v1/order/${this.getNodeParameter('folio', i)}/comment`;

				const orderData = {
					comments: [this.getNodeParameter('comment', i)],
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

				returnData.push({
					json: data,
				});
			}
		} catch (error) {
			returnData.push({
				json: { error: error.message || error },
				error,
			});
		}
		return [returnData];
	}
}
