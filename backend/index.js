import "dotenv/config";
import './bootstrap/database';
import { app as server } from './bootstrap/server';

const PORT = process.env.SERVER_PORT || 8000;

// process.on('uncaughtException', (err) => {
//     console.log('Uncaught Exception: ', err);
//     // console.log(err.stack);
// });
//
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

process.on('rejectionHandled', (err) => {
    console.log(err.code);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`app running on port ${PORT}`);
});