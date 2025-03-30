import mongoose from 'mongoose';

class TransactionRepo {
    /**
     * @param {Object} defaultConfiguration optional parameter to add session options
     * @returns {TransactionSession} A new Tranaction sessions
     */
    async initTransactionSession() {
            return await mongoose.startSession();
        }
        /**
         * @param {Object} currentActiveSession optional parameter to add session options
         * @returns null
         */
    async endSession(session) {
            session.endSession();
        }
        /**
         * @param {session} currentActiveSession active transaction session instance
         * @param {callback} callback function to execute with transaction
         * @param {options} transactionOptions optional parameter to add session options
         * @returns {Transaction} A new Tranaction result and is active
         */
    async startTransaction(session, callback, options = {}) {
        try {
            session.startTransaction();
            const response = await callback();
            if (response.error) await session.abortTransaction();
            else await session.commitTransaction();
            return response;
        } finally {
            session.endSession();
        }
    }
}
export default new TransactionRepo();