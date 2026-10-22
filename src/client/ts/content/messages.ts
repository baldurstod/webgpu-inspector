export type Messages =
	'get-runtime-url'
	| 'response-get-runtime-url'
	;

export type Message = {
	action: Messages;
};

export type MessageAny = Message & {
	promiseId: number;
};

export type GetRuntimeURL = MessageAny & {
	url: string;
};

const promises = new Map<number, (value: unknown) => void>();
let nextPromiseId = 1;

export function createPromise(): { promise: Promise<any>, promiseId: number } {
	let promiseId = nextPromiseId++;
	let promise = new Promise<any>((resolve) => {
		promises.set(promiseId, resolve);
	});
	return { promise: promise, promiseId: promiseId };
}

function resolvePromise(promiseId: number, resolveValue?: any) {
	let promiseResolve = promises.get(promiseId);
	if (promiseResolve) {
		promiseResolve(resolveValue);
	}
}

window.addEventListener('message', event => onMessage(event));

function onMessage(event: MessageEvent<Message>) {
	let messageData = event.data;
	//console.log(event);
	switch (messageData.action) {
		case 'response-get-runtime-url':
			resolvePromise((messageData as GetRuntimeURL).promiseId, (messageData as GetRuntimeURL).url);
			break;
	}
}

export async function getRuntimeURL(url: string): Promise<string> {
	let { promise, promiseId } = createPromise();
	//requestMySellOrders(listingId: string);

	window.postMessage({ action: 'get-runtime-url', url, promiseId: promiseId }, '*');
	return await promise;
}
