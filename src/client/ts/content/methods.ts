import { Map2 } from 'harmony-utils';
import { ContextType } from './record';


const methods = new Map2<ContextType, string, Function>();

export function addMethod(contextId: ContextType, methodName: string, method: Function) {
	methods.set(contextId, methodName, method);
}

export function getMethod(contextId: ContextType, methodName: string): Function | undefined {
	return methods.get(contextId, methodName);
}
