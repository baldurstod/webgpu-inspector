import { Application } from './application';
import { readyPromise } from './ready';

async function startup(): Promise<void> {
	await readyPromise;
}

void startup();

new Application();
