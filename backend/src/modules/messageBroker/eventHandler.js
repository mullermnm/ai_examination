export default () => {
    if (global.REDIS_SERVICE) {
        REDIS_SERVICE.subscriber.subscribe('event1', (item) => {
            console.log('event1 fired', JSON.parse(item));
        });
    }
}