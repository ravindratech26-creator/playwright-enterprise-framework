import { Logger } from './utils/Logger';

async function globalTeardown() {
    Logger.info('========== GLOBAL TEARDOWN: TEST RUN COMPLETE ==========');
}

export default globalTeardown;
