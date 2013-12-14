function start(){
	console.log("Request for start called");
	
	return "Hello Start"
}

function upload(){
	console.log("Request for upload called");
	return "Hello upload"
}

exports.start = start;
exports.upload = upload;