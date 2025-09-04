import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';

export class Order implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Order detail by id',
		name: 'order',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Get order details from Jelp Delivery',
		defaults: {
			name: 'Get Order',
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
				name: 'reference',
				type: 'string',
				default: '',
				description: 'Folio or publicId of the order',
				required: true
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const baseUrl = 'https://workspaces.api.sad.jelp.io'
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const reference = this.getNodeParameter('reference', i) as string;
			const url = `${baseUrl}/dev/v1/order/${reference}`;

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
