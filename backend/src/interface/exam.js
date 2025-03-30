import BaseRepo from './BaseRepo.js';
import { model } from '../models/exam.js';


class ExamRepo extends BaseRepo {

    constructor(model) {
        super(model);
    }
    
        
    async getOneByCondition(condition, query = {}, exclude = []) {
        return await super.getOneByCondition(condition,query,exclude);
    }
    async getById(id, query = {}, exclude = []) {
        return await super.getById(id,query,exclude);
    }
    async getAll(query, exclude = []) {
       return await super.getAll(query, exclude)
    }
    async checkIfItExists(condition,populate) {
        return await super.checkIfItExists(condition, populate);
    }


    

    //write your logic in here
};

export default new ExamRepo(model);