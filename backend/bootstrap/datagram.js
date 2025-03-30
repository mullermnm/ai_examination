import dgram from 'dgram';
import config from 'config';

class UdpConnection {
    constructor() {
        const initialize = () => {

            this.connection = dgram.createSocket('udp4');
            this.connection.on('message', this.messageCallback),
                this.connection.on('listening', () => {
                    console.log('app listenning on ', config.get('udp_port'))
                });
            this.connection.bind(config.get('udp_port'));
            global.UDP_CONNECTION = this.connection;
        }

        if (!global.UDP_CONNECTION) {
            initialize()
        }

    }
    async messageCallback(data, info) {
        console.log('new message')
    }
}
export default new UdpConnection();