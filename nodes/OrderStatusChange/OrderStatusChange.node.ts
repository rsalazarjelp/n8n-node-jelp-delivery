import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderStatusChange implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Change order status',
		name: 'orderStatusChange',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Change order status, you can cancel and order using the status CANCELED, rest of available status are PENDING, ACCEPTED, DRIVER_IN_BRANCH, TRANSIT, ONSITE and COMPLETED, needs order ID and status',
		defaults: {
			name: 'Change order status',
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
				displayName: 'Order',
				name: 'order',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const url = `${BASE_URL}/dev/v3/order/status/update`;

			const orderData = {
				referenceId: this.getNodeParameter('order', i),
				status: this.getNodeParameter('status', i),
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
