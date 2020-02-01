/* eslint-disable */
import ApiService from 'services/api';


class SettingsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'settings';
	}
}

export default new SettingsApiService();