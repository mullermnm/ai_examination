import eventHandler from './eventHandler';

class MessageBroker {

    async listenEvents() {
        eventHandler();
    }
    async sendMessage(eventName, data) {
        await REDIS_SERVICE.client.publish(eventName, JSON.stringify(data));
    }
    async requestReplay(data) {
        // await REDIS_SERVICE.client.publish(eventName, data);
        console.log(data, 'under construction');
        return data;
    }
    async setValue(key, data) {
        return await REDIS_SERVICE.client.set(key, JSON.stringify(data))
    }
    async getValue(key) {
        const value = await REDIS_SERVICE.client.get(key);
        return JSON.parse(value);
    }
    async deleteValue(key) {
        const value = await REDIS_SERVICE.client.del(key);
        return value == 1 ? {
            error: false,
            message: 'deleted succesfully'
        } : {
            error: true,
            message: "failed to delete"
        }
    }
}


export default new MessageBroker();