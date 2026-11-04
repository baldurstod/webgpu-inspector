import { Map2 } from 'harmony-utils';
import { ContextType } from './record';

type ContextType2 = ContextType | 'canvas2d' | 'offscreencanvas';

const methods = new Map2<ContextType2, string, Function>();

export function addMethod(contextId: ContextType2, methodName: string, method: Function) {
	methods.set(contextId, methodName, method);
}

export function getMethod(contextId: ContextType2, methodName: string): Function | undefined {
	return methods.get(contextId, methodName);
}
