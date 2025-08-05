import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class BranchList implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'List of branches',
		name: 'branchList',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description: 'Get a list of branches from Jelp Delivery',
		defaults: {
			name: 'Get Branches',
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
		requestDefaults: {
			baseURL: 'https://api.torredecontrol.io',
			url: '/dev/v1/branches',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			qs: {
				limit: '={{ $parameter["limit"] || 50 }}',
				page: '={{ $parameter["page"] || 0 }}',
			}
		},
		properties: [ {
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 5,
				},
				default: 50,
				description: 'Max number of results to return',
			},{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				typeOptions: {
					minValue:0,
				},
				default: 0,
				description: 'Page number for pagination',
			},],
	};
}
