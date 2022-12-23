var express = require('express');
var router = express.Router();
var moment = require('moment');
const dotenv = require('dotenv').config();
var axios = require('axios').default;


axios.defaults.baseURL = process.env.GS_URL;
axios.defaults.withCredentials = true;

/* GET users listing. */
router.post('/position', function (req, res, next) {
	var position = req.body.position;
	var device = req.body.device;
	var posAttr = {}
	var eventVal = "";
	var data = {};
	var paramData = [];

	for (const key in position.attributes) {
		var param;
		if(position.attributes[key] === true){
			param =  key.toString()+"="+"1";
		}else if(position.attributes[key] === false){
			param =  key.toString()+"="+"0";
		}else{
			param = key.toString()+"="+position.attributes[key].toString();
		}
		if (key === "alarm") {
			eventVal = position.attributes[key].toString();
		}
		paramData.push(param);
	}


	if (position.valid) {
		var time = moment.utc(position.fixTime).format("yyyy-MM-DD HH:mm:ss");
		var factor = 1.852;
		var speedVal = position.speed * factor;
		var url;
		if(eventVal === "") {
			url = "api/api_loc.php?imei=" + device.uniqueId+"&dt="+time+"&protocol="+position.protocol+"&deviceId="+device.id.toString()+"&lat=" + position.latitude.toString() + "&lng=" + position.longitude.toString() + "&altitude=" + position.altitude.toString() + "&angle=" + position.course.toString() + "&speed=" + speedVal.toString() + "&loc_valid=1&params="+paramData.join('|')+"|"
		}else{
			url = "api/api_loc.php?imei=" + device.uniqueId+"&dt="+time+"&protocol="+position.protocol+"&deviceId="+device.id.toString()+"&lat=" + position.latitude.toString() + "&lng=" + position.longitude.toString() + "&altitude=" + position.altitude.toString() + "&angle=" + position.course.toString() + "&speed=" + speedVal.toString() + "&loc_valid=1&params="+paramData.join('|')+"|&event="+eventVal+""
		}
		axios({
			url: url,
			method: 'get',
			headers: {
				'Content-Type': 'application/json'
			},
		})
			.then(function (response) {
				res.send(response.data)
			})
			.catch(function (error) {
				console.log("error");
				console.log(error)
			})

	} else {
		data = {
			op: "noloc",
			imei: device.uniqueId,
			protocol: position.protocol,
			net_protocol: "tcp",
			params: JSON.stringify(posAttr),
			event: eventVal,
			ip: "",
			port: "",
			deviceId: device.id.toString(),
		};

		axios({
			url: 'server/http/listener.php',
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify([data])
		})
			.then(function (response) {
				res.send(response.data)
			})
			.catch(function (error) {
				console.log("error");
				console.log(error)
			})
	}

});


module.exports = router;
