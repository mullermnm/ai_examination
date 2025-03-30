import errorMessages from "../messages/errorMessages";
import ApplicationError from "./Error";

export default async function To(callback) {
    try {
        return await callback();
    } catch (err) {
        let status = parseInt(err.message);
        if (isNaN(status)) {
            return new ApplicationError(err.message || errorMessages[500], 500);
        } else {
            switch (status) {
                case 404:
                    return new ApplicationError(errorMessages[404], 404);
                case 401:
                    return new ApplicationError(errorMessages[401], 401);

                case 403:
                    return new ApplicationError(errorMessages[403], 403);

                case 422:
                    return new ApplicationError(errorMessages[422], 422);

                default:
                    return new ApplicationError(errorMessages[500], 500);
            }
        }
    }
}