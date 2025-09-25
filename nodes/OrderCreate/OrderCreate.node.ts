import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	INodeExecutionData,
	IExecuteFunctions,
} from 'n8n-workflow';
import { BASE_URL } from '../constants';

export class OrderCreate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Create order',
		name: 'orderCreate',
		icon: { light: 'file:Icon.svg', dark: 'file:Icon.svg' },
		group: ['transform'],
		version: 1,
		description:
			'Create an order in Jelp Delivery, needs first name, phone, phone, branch, payment method code, total, subtotal, is paid, paid with',
		defaults: {
			name: 'Create Order',
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
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'First Last Name',
				name: 'firstLastName',
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
				displayName: 'Full Address',
				name: 'fullAddress',
				type: 'string',
				default: '',
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
				displayName: 'Extension',
				name: 'extension',
				type: 'string',
				default: '',
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
				displayName: 'Subtotal',
				name: 'subtotal',
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
				displayName: 'Paid With',
				name: 'paidWith',
				type: 'number',
				default: 0,
				required: true,
			},
			{
				displayName: 'Scheduled Date',
				name: 'scheduledDate',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags',
			},
			{
				displayName: 'Vehicle Types',
				name: 'vehicleTypes',
				type: 'string',
				default: 'MOTORCYCLE',
				description: 'Comma-separated vehicle types',
			},
			{
				displayName: 'Is Automatic Assignment',
				name: 'isAutomaticAssignment',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Public ID',
				name: 'publicId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Tracking ID',
				name: 'trackingId',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Order Type',
				name: 'orderType',
				type: 'string',
				default: 'DELIVERY',
			},
			{
				displayName: 'Pickup Code',
				name: 'pickupCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Delivery Code',
				name: 'deliveryCode',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Cooking Time',
				name: 'cookingTime',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Required Skills',
				name: 'requiredSkills',
				type: 'string',
				default: '',
				description: 'Comma-separated skills',
			},
			{
				displayName: 'Prescription Action',
				name: 'prescriptionAction',
				type: 'string',
				default: 'NONE',
			},
			{
				displayName: 'Comment',
				name: 'comment',
				type: 'string',
				default: '',
			},
			{
				displayName: 'References',
				name: 'references',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Products',
				name: 'products',
				type: 'string',
				default: '',
				description: 'Product details in JSON format',
				placeholder: '[{"sku":"123","name":"Product 1","price":100,"quantity":1}]',
			},
			{
				displayName: 'User Name',
				name: 'userName',
				type: 'string',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		function generateUUID() {
			return 'xxxxxxxxy'.replace(/[xy]/g, function (c) {
				var r = (Math.random() * 16) | 0,
					v = c == 'x' ? r : (r & 0x3) | 0x8;
				return v.toString(16);
			});
		}
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		try {
			const credentials = await this.getCredentials('jelpDeliveryApi');
			for (let i = 0; i < items.length; i++) {
				const productsRaw = this.getNodeParameter('products', i) as string;
				let products: any[] = [];
				try {
					products = JSON.parse(productsRaw);
				} catch (e) {
					products = [];
				}

				let trackingId = this.getNodeParameter('trackingId', i);
				trackingId = trackingId != null && trackingId != '' ? trackingId : generateUUID();

				let publicId = this.getNodeParameter('publicId', i);
				publicId = publicId != null && publicId != '' ? publicId : trackingId;

				const orderData = {
					userData: {
						fullName: this.getNodeParameter('userName', i),
					},
					customer: {
						firstName: this.getNodeParameter('firstName', i),
						firstLastName: this.getNodeParameter('firstLastName', i),
						fullName: `${this.getNodeParameter('firstName', i)} ${this.getNodeParameter('firstLastName', i)}`,
					},
					address: {
						references: this.getNodeParameter('references', i),
						fullAddress: this.getNodeParameter('fullAddress', i),
						latitude: this.getNodeParameter('latitude', i),
						longitude: this.getNodeParameter('longitude', i),
					},
					phone: {
						phone: this.getNodeParameter('phone', i),
						countryCode: this.getNodeParameter('countryCode', i),
						extension:
							this.getNodeParameter('extension', i) === ''
								? null
								: this.getNodeParameter('extension', i),
					},
					branch: this.getNodeParameter('branch', i),
					paymentMethod: this.getNodeParameter('paymentMethod', i),
					total: this.getNodeParameter('total', i),
					products: products,
					subtotal: this.getNodeParameter('subtotal', i),
					paidWith: this.getNodeParameter('paidWith', i),
					isPaid: this.getNodeParameter('isPaid', i),
					scheduledDate:
						this.getNodeParameter('scheduledDate', i) === ''
							? null
							: this.getNodeParameter('scheduledDate', i),
					tags:
						this.getNodeParameter('tags', i) == null ||
						String(this.getNodeParameter('tags', i)).trim() === ''
							? []
							: String(this.getNodeParameter('tags', i))
									.split(',')
									.map((t: string) => t.trim())
									.filter((t: string) => t.length > 0),
					vehicleTypes:
						this.getNodeParameter('vehicleTypes', i) != null
							? String(this.getNodeParameter('vehicleTypes', i))
									.split(',')
									.map((v: string) => v.trim())
							: [],
					isAutomaticAssignment: this.getNodeParameter('isAutomaticAssignment', i),
					publicId: publicId,
					trackingId: trackingId,
					orderType: this.getNodeParameter('orderType', i),
					pickupCode: this.getNodeParameter('pickupCode', i),
					deliveryCode: this.getNodeParameter('deliveryCode', i),
					config: {
						cookingTime: this.getNodeParameter('cookingTime', i),
					},
					requiredSkills: String(this.getNodeParameter('requiredSkills', i) ?? '')
						.split(',')
						.map((s: string) => s.trim())
						.filter((s: string) => s.length > 0),
					prescriptionAction: this.getNodeParameter('prescriptionAction', i),
					comment: this.getNodeParameter('comment', i),
				};

				const options = {
					method: 'POST' as 'POST',
					url: `${BASE_URL}/dev/v3/order`,
					headers: {
						'api-key': credentials.key,
						sign: credentials.sign,
						accept: 'application/json',
						'content-type': 'application/json',
					},
					body: orderData,
					json: true,
				};
				const response = await this.helpers.request(options);
				returnData.push({ json: response });
			}
		} catch (error) {
			returnData.push({
				json: { error: error.message || error },
				error,
			});
		}
		return this.prepareOutputData(returnData);
	}
}
