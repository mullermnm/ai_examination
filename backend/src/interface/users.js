import BaseRepo from './BaseRepo.js';
import { model } from '../models/users.js';
import jwt from 'jsonwebtoken';


class UsersRepo extends BaseRepo {

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


    async getUserToken(memberId, data) {  
        const payload = {
          id: data._id,
          userRole: data.userRole,  
          ...data, 
        };
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: process.env.JWT_EXPIRY,
        });
      }

    //write your logic in here
};

export default new UsersRepo(model);