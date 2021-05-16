/**
 * /* eslint-disable
 *
 * @format
 */

import ApiService from "services/api";
import api from "services/backend";
const AttachmentsApiSingleton = (function () {
	class AttachmentsApiService extends ApiService {
		constructor() {
			super();
			this.service_uri = "attachments";
		}

		async upload(data, params = {}) {
			let endpoint_uri = this.service_uri + "/upload";
			let that = this;
			return await this.apiInstance
				.post(endpoint_uri, data, params)
				.then(function(response) {
					let resobj = {
						err: false,
						body: response.data,
						code: response.status,
						headers: response.headers,
					};
					return resobj;
				})
				.catch(function(error) {
					that.handleRequestError(error);
				});
		}

		async download(attachment) {
			let that = this;
			let id = attachment;
			let attachment_rec = null;
			let error = false;
			if (JSON.isJSON(attachment)) {
				id = attachment._id;
				attachment_rec = attachment;
			}
			if (attachment_rec === null) {
				attachment_rec = await this.getRecordById(id, {})
					.then(res => {
						return res.body.data;
					})
					.catch(e => {
						that.handleRequestError(e);
					});
			}
			if (JSON.isJSON(attachment_rec)) {
				const download_url = this.getAttachmentFileUrl(attachment_rec);

				return await api.request({
						responseType: "arraybuffer",
						url: download_url,
						method: "get",
						headers: {
							"Content-Type": attachment_rec.mime,
						},
					})
					.then(response => {
						let blob = new Blob([response.data]);
						blob.lastModifiedDate = new Date();
						blob.name = attachment_rec.name;
						/* const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.setAttribute('download', attachment_rec.name);
					document.body.appendChild(link);
					link.click();
					link.parentNode.removeChild(link); */
						return new File([blob], attachment_rec.name, {
							lastModified: new Date().getTime(),
							type: attachment_rec.mime,
						});
					})
					.catch(e => {
						that.handleRequestError(e);
					});
			} else {
				throw error;
			}
		}

		getAttachmentFileUrl(attachment) {
			return (
				this.base_url +
				this.service_uri +
				"/download/" +
				(JSON.isJSON(attachment) && "_id" in attachment
					? attachment._id
					: attachment)
			);
		}

		async getAttachmentFile(attachment) {
			let endpoint_uri =
				this.service_uri + "/download/" + JSON.isJSON(attachment)
					? attachment._id
					: attachment;

			let response = await this.apiInstance
				.get(endpoint_uri, {}, { responseType: "stream" })
				.then(({ data }) => {
					const file = new Blob([data], { type: attachment.type });
					return file;
				});

			//var blob = new Blob([typedArray.buffer], {type: 'application/octet-stream'});
		}

		async image(attachment) {
	        let image_url = this.getAttachmentFileUrl(attachment);
	        let image = new Image();

	        image.onload = () => {};
	        image.src = image_url;
	    }

		async getAttachmentFileById(id) {
			let file_url = this.service_uri + "/download/" + id;
			var reader = new FileReader();

			return this.apiInstance
				.get(this.service_uri + "/" + id, {})
				.then(res => {
					let attachment = res.data.data;
					return this.apiInstance
						.get(file_url, {}, { responseType: "stream" })
						.then(({ data }) => {
							return data;
						});
				});
		}
	}
	return new AttachmentsApiService();
})();
export default AttachmentsApiSingleton;
