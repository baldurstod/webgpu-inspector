import { Map2 } from 'harmony-utils';
import { ContextType } from './record';

type ContextType2 = ContextType | 'canvas2d' | 'offscreencanvas';

const methods = new Map2<ContextType2, string, Function>();

export function addOriginalMethod(contextId: ContextType2, methodName: string, method: Function) {
	if (methods.has(contextId, methodName)) {
		console.error(`This method has already been set ${contextId} ${methodName}`);
		return;
	}
	methods.set(contextId, methodName, method);
}

export function getOriginalMethod(contextId: ContextType2, methodName: string): Function | undefined {
	return methods.get(contextId, methodName);
}
