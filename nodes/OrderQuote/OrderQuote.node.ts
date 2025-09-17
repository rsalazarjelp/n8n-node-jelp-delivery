import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderQuote implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Quote order',
		name: 'orderQuote',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description:
			'Quote an order in Jelp Delivery, needs customer full name, latitude, longitude, phone, country code, branch, payment method, total, is paid, full address, city, state, zip code, items and partnership',
		defaults: {
			name: 'Quote Order',
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
				displayName: 'Customer Fullname',
				name: 'fullName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				type: 'string',
				default: '+52',
				required: true,
			},
			{
				displayName: 'Branch',
				name: 'branch',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Payment Method',
				name: 'paymentMethod',
				type: 'string',
				default: 'cash',
				required: true,
			},
			{
				displayName: 'Total',
				name: 'total',
				type: 'number',
				default: 0,
				required: true,
			},
			{
				displayName: 'Is Paid',
				name: 'isPaid',
				type: 'boolean',
				default: true,
				required: true,
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Neighborhood',
				name: 'neighborhood',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Interior Number',
				name: 'interiorNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Exterior Number',
				name: 'exteriorNumber',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'City',
				name: 'cityName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Full Address',
				name: 'fullAddress',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Address Type',
				name: 'addressType',
				type: 'string',
				default: 'HOME',
			},
			{
				displayName: 'References',
				name: 'references',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Partnership',
				name: 'partnership',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		try {
			for (let i = 0; i < items.length; i++) {
				const url = `${BASE_URL}/api/v1/pre-order/overflow/quote`;

				const orderData = {
					total: this.getNodeParameter('total', i),
					partnership: this.getNodeParameter('partnership', i),
					isPaid: this.getNodeParameter('isPaid', i),
					paymentMethod: this.getNodeParameter('paymentMethod', i),
					phone: {
						phone: this.getNodeParameter('phone', i),
						countryCode: this.getNodeParameter('countryCode', i),
					},
					address: {
						street: this.getNodeParameter('street', i),
						neighborhood: this.getNodeParameter('neighborhood', i),
						interiorNumber: this.getNodeParameter('interiorNumber', i),
						exteriorNumber: this.getNodeParameter('exteriorNumber', i),
						zipCode: this.getNodeParameter('zipCode', i),
						cityName: this.getNodeParameter('cityName', i),
						fullAddress: this.getNodeParameter('fullAddress', i),
						addressType: this.getNodeParameter('addressType', i),
						references: this.getNodeParameter('references', i),
						location: [this.getNodeParameter('longitude', i), this.getNodeParameter('latitude', i)],
					},
					branch: this.getNodeParameter('branch', i),
					customerData: {
						fullName: this.getNodeParameter('fullName', i),
					},
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
