import { doItLater } from './EventUtil';
let stompClient = undefined;
let wsConnected = false;
let websocketUrl = undefined;
const onConnectCallbacks = new Array();
const subscriptionCallbacks = new Array();
export const isWsConnected = () => {
	return wsConnected == true;
}
export const setWebSocketUrl = (url) => {
	websocketUrl = url;
}
export const sendToWebsocket = (url, requestObject) => {
	if (!wsConnected || !stompClient) {
		console.info("Connecting");
		return false;
	}
	console.debug("SEND WEBSOCKET")
	stompClient.send(url, {}, JSON.stringify(requestObject));
	return true;
}

export const addOnWsConnectCallbacks = (...callbacks) => {
	for (let i = 0; i < callbacks.length; i++) {
		const element = callbacks[i];
		onConnectCallbacks.push(element);
	}
}

export const performWebsocketConnection = () => {

	return;
	var socket = new window.SockJS(websocketUrl);
	stompClient  = window.Stomp.over(socket);
	stompClient .connect({}, function (frame) {
		wsConnected = true;
		// setConnected(true);
		console.log('Websocket CONNECTED: ', websocketUrl, 'frame :', frame, stompClient.ws._transport.ws.url);
		console.debug("subscriptionCallbacks :", subscriptionCallbacks.length);
		// document.getElementById("ws-info").innerHTML =
		// stompClients.ws._transport.ws.url;
		for (let i = 0; i < subscriptionCallbacks.length; i++) {
			const callBackObject = subscriptionCallbacks[i];

			if (callBackObject) {

				stompClient.subscribe(callBackObject.subscribeUrl, (response) => {
					var respObject = JSON.parse(response.body);
					callBackObject.callback(respObject);
				});
			}
		}

		for (var i = 0; i < onConnectCallbacks.length; i++) {
			const callback = onConnectCallbacks[i];
			callback(frame);
		}

	}, (e) => {
		console.warn("Error connection websocket, reconnect");
		doItLater(performWebsocketConnection, 2000);
	});

	 
}

 /**
  * 
  * @param  {...WsCallback} callBackObjects 
  */
export const registerWebSocketCallbacks = (...callBackObjects) => {

	if (null == callBackObjects) {
		return;
	}
	for (var i = 0; i < callBackObjects.length; i++) {
		subscriptionCallbacks.push(callBackObjects[i]);
	}
}
