/* eslint-disable */
import ApiService from 'services/api';


class PostsApiService extends ApiService{
	constructor(){
		super();
		this.service_uri = 'posts';
	}
	
}

export default new PostsApiService();