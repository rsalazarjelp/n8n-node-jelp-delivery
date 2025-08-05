import { INodeType, INodeTypeDescription, IExecuteFunctions, NodeConnectionType } from 'n8n-workflow';

export class OrderCreate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'New order',
		name: 'orderCreate',
		icon: { light: 'file:OrderCreate.svg', dark: 'file:OrderCreate.svg' },
		group: ['transform'],
		version: 1,
		description: 'Create an order in Jelp Delivery',
		defaults: {
			name: 'Create Order',
		},

		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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
				required: true,
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'number',
				default: 0,
				required: true,
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'number',
				default: 0,
				required: true,
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
				required: true,
			},
			{
				displayName: 'Is Automatic Assignment',
				name: 'isAutomaticAssignment',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Public ID',
				name: 'publicId',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Tracking ID',
				name: 'trackingId',
				type: 'string',
				default: '',
				required: true,
			},
			{
				displayName: 'Order Type',
				name: 'orderType',
				type: 'string',
				default: 'DELIVERY',
				required: true,
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
				displayName: 'Products',
				name: 'prodicts',
				type: 'string',
				default: '',
				description: 'Product details in JSON format',
				placeholder: '[{"sku":"123","productName":"Product 1","productPrice":100,"productQuantity":1,"productTotal":100,"productWidth":10,"productHeight":10,"productDepth":10,"productWeight":1,"productImage":"http://example.com/image.jpg"}]',
			},
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData = [];
		const credentials = await this.getCredentials('jelpDeliveryApi');
		for (let i = 0; i < items.length; i++) {
			const productsRaw = this.getNodeParameter('prodicts', i) as string;
			let products: any[] = [];
			try {
				products = JSON.parse(productsRaw);
			} catch (e) {
				products = [];
			}

			const orderData = {
				customer: {
					firstName: this.getNodeParameter('firstName', i),
					firstLastName: this.getNodeParameter('firstLastName', i),
					fullName: `${this.getNodeParameter('firstName', i)} ${this.getNodeParameter('firstLastName', i)}`,
				},
				address: {
					latitude: this.getNodeParameter('latitude', i),
					longitude: this.getNodeParameter('longitude', i),
				},
				phone: {
					phone: this.getNodeParameter('phone', i),
					countryCode: this.getNodeParameter('countryCode', i),
					extension: this.getNodeParameter('extension', i) === '' ? null : this.getNodeParameter('extension', i),
				},
				branch: this.getNodeParameter('branch', i),
				paymentMethod: this.getNodeParameter('paymentMethod', i),
				total: this.getNodeParameter('total', i),
				products: products,
				subtotal: this.getNodeParameter('subtotal', i),
				paidWith: this.getNodeParameter('paidWith', i),
				isPaid: this.getNodeParameter('isPaid', i),
				scheduledDate: this.getNodeParameter('scheduledDate', i) === '' ? null : this.getNodeParameter('scheduledDate', i),
				tags:
					this.getNodeParameter('tags', i) == null ||
					String(this.getNodeParameter('tags', i)).trim() === ''
						? []
						: String(this.getNodeParameter('tags', i))
								.split(',')
								.map((t: string) => t.trim())
								.filter((t: string) => t.length > 0),
				vehicleTypes: this.getNodeParameter('vehicleTypes', i) != null
					? String(this.getNodeParameter('vehicleTypes', i)).split(',').map((v: string) => v.trim())
					: [],
				isAutomaticAssignment: this.getNodeParameter('isAutomaticAssignment', i),
				publicId: this.getNodeParameter('publicId', i),
				trackingId: this.getNodeParameter('trackingId', i),
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
				url: 'https://api.torredecontrol.io/dev/v3/order',
				headers: {
					'api-key': credentials.key,
					'sign': credentials.sign,
					'accept': 'application/json',
					'content-type': 'application/json',
				},
				body: orderData,
				json: true,
			};
			const response = await this.helpers.request(options);
			returnData.push({ json: response });
		}

		return this.prepareOutputData(returnData);
	}
}
