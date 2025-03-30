import SuccessResponse from '../response/SuccessReponse';
import ErrorResponse from '../response/ErrorResponse';
import MessageBroker from '../modules/messageBroker';

class Service {
    constructor(repo) {
        this.repo = repo;
        this.successResponse = SuccessResponse;
        this.errorResponse = ErrorResponse;
        this.messageBroker = MessageBroker;
        this.messageBroker.listenEvents();
    }
}

export default Service