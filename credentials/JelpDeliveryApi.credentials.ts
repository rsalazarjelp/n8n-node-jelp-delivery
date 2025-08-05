import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class JelpDeliveryApi implements ICredentialType {
	name = 'jelpDeliveryApi';
	displayName = 'Jelp Delivery Credentials API';

	documentationUrl = 'https://jelp-delivery.readme.io/docs/getting-started';

	properties: INodeProperties[] = [
		{
			displayName: 'Api Key',
			name: 'key',
			type: 'string',
			typeOptions: { password: true },
			default: undefined
		},
		{
			displayName: 'Sign',
			name: 'sign',
			type: 'string',
			typeOptions: { password: true, },
			default: undefined
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'api-key': '={{ $credentials.key }}',
				'sign': '={{ $credentials.sign }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.torredecontrol.io/dev/v1/branches?limit=1',
			url: '',
		},
	};
}
