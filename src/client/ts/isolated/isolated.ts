import { GetRuntimeURL, Message } from '../content/messages';

window.addEventListener('message', (event: MessageEvent<Message>) => {
	let messageData = event.data;
	switch (messageData.action) {
		case 'get-runtime-url':
			const url = chrome.runtime.getURL((messageData as GetRuntimeURL).url);
			window.postMessage({ action:'response-get-runtime-url', url, promiseId: (messageData as GetRuntimeURL).promiseId }, '*');
			break;
	}
});

window.postMessage({ action: 'injected_ready' }, '*');
