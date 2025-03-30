import mongoose from "mongoose";
import seedUsers from "./dbSeeder";

class Connection {
    constructor() {
        const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        // const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        console.log("Establish new connection with db", url);
        mongoose.Promise = global.Promise;
        mongoose.set("useNewUrlParser", true);
        mongoose.set("useFindAndModify", false);
        mongoose.set("useUnifiedTopology", true);
        mongoose.connect(url);
        mongoose.connection.on('error', console.error.bind(console, 'database connection error:'));
		mongoose.connection.once('open', async () => {
			console.log('connected to db succesfully!!!');
			await seedUsers();
			console.log('db seeded succesfully!!!');
		});
		mongoose.connection.on('disconnected', function () {
			//Reconnect on timeout
			mongoose.connect(url)
				.catch(error => {
					console.log('failed to reach database ....:', error);
				});
		});
    }
}

export default new Connection();