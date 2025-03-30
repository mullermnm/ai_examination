import { createClient } from 'redis';
import config from 'config';

class RedisService {
    constructor() {

    }
    async init() {
        this.client = createClient({
            url: `redis://${config.get('redis.host')}:${config.get('redis.port')}`
        });
        this.client.on('error', this.connectionErrorCallback);
        this.client.on('ready', () => console.log('connected with redis server.'));
        console.info('Initializing Connection With Redis Server....');
        await this.client.connect();
        this.subscriber = await this.client.duplicate();
        global.REDIS_SERVICE = this;
    }
    async connectionErrorCallback() {
        console.error('Failed To Connect With Redis Check If Redis Server Is Up And Runing.');
        console.warn('Exiting App Redis Server Is Down !!');
        // process.exit(0);
    }
}


export default new RedisService();