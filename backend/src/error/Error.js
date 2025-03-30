class ApplicationError extends Error {
    constructor(message,status){
       super(message)
       this.statusCode=status;
       this.info=message;
       this.error=true;
       this.data=null;
    }
}

export default ApplicationError;