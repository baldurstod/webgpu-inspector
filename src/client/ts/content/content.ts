import { Application } from './application';
import { readyPromise } from './ready';
import { initWebGL2RenderingContext } from './webgl2';

// This must be done before waiting for readiness
//initWebGL2RenderingContext();

async function startup(): Promise<void> {
	await readyPromise;
}

void startup();

new Application();
