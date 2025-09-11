import { INodeType, INodeTypeDescription, NodeConnectionType, INodeExecutionData, IExecuteFunctions } from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class BranchList implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Branches',
		name: 'branchList',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Get a list of branches from Jelp Delivery, uses limit and page for pagination',
		defaults: {
			name: 'Branches',
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
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 5,
				},
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: 0,
				description: 'Page number for pagination',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const limit = this.getNodeParameter('limit', i) as number;
			const page = this.getNodeParameter('page', i) as number;

			const options = {
				method: 'GET' as const,
				url: `${BASE_URL}/dev/v1/branches`,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				qs: {
					limit,
					page,
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
