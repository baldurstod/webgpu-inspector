let readyPromiseResolve: () => void;
export const readyPromise = new Promise<void>(resolve => {
	readyPromiseResolve = resolve;
});

const onLoad = (): void => {
	readyPromiseResolve();
	removeEventListener('load', onLoad);
}

addEventListener('load', onLoad);
