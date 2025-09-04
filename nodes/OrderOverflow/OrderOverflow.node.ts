import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';

export class OrderOverflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Overflow order',
		name: 'orderOverflow',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Overflow an order in Jelp Delivery',
		defaults: {
			name: 'Order Overflow',
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
				name: 'order',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Partnership',
				name: 'partnership',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Workspace Partnership',
				name: 'workspacePartnership',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Vehicle Type',
				name: 'vehicleType',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const baseUrl = 'https://workspaces.api.sad.jelp.io'
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const url = `${baseUrl}/api/v1/workspace-partnership/services/overflow`;

			const orderData = {
				order: this.getNodeParameter('order', i),
				partnership: this.getNodeParameter('partnership', i),
				workspacePartnership: this.getNodeParameter('workspacePartnership', i),
				vehicleType: this.getNodeParameter('vehicleType', i),
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
