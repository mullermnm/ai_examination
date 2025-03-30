function modelTemplate(filename) {
    filename = filename[0].toUpperCase() + filename.slice(1);
    return `import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    unionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unions",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },

    //define your schema here

    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Members",
      required: true,
    },
    modifiedBy: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Members",
        },
        status: String,
        comment: String,
      },
    ],

    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Inactive", "Deleted"],
    },
  },
  {
    timestamps: true,
    id: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
export const model = mongoose.model("${filename}", schema);`;
}

function servcieTemplate(servicFullPath, modelPath) {
    const allPaths = servicFullPath.split('/');
    const serviceBasePath = allPaths.length > 1 ? allPaths.slice(0, -1).map(item => '../').join(',') : './';
    const formattedName = allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);
    return `import Service from '${serviceBasePath}Service';
    
class ${formattedName}Service extends Service {

    constructor(repo) {
        super(repo);
    }
           
    //write your logic in here
};

export default ${formattedName}Service;`
}

function controllerTemplate(controllerFullPath, fullModelPath) {

    const allPaths = controllerFullPath.split('/');
    const baseControllerPath = allPaths.length > 1 ? allPaths.slice(0, -1).map(item => '../').join(',') : './';
    const formattedName = allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);
    return `import Controller from '${baseControllerPath}Controller';
import ${formattedName}Repo from '${baseControllerPath=="./"?"":baseControllerPath}../interface/${controllerFullPath}.js';
import ${formattedName}Service from '${baseControllerPath=="./"?"":baseControllerPath}../services/${controllerFullPath}.js';
    
const ${allPaths.slice(-1)[0]}_service = new ${formattedName}Service(${formattedName}Repo);

class ${formattedName}Controller extends Controller {

    constructor(service) {
        super(service);
    }

    //write your logic in here
};

export default new ${formattedName}Controller(${allPaths.slice(-1)[0]}_service);`
}

function interfaceTemplate(interfaceFullPath, fullModelPath) {

    const allPaths = interfaceFullPath.split('/');
    const baseInterfacePath = allPaths.length > 1 ? allPaths.slice(0, -1).map(item => '../').join(',') : './';
    const formattedName = allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);
    return `import BaseRepo from '${baseInterfacePath}BaseRepo';
import { model } from '${baseInterfacePath=="./"?"":baseInterfacePath}../models/${interfaceFullPath}.js';
    
class ${formattedName}Repo extends BaseRepo {

    constructor(model) {
        super(model);
    }
        
    async getOneByCondition(condition, query = {}, exclude = []) {
        return await super.getOneByCondition(condition,query,exclude);
    }
    async getAll(query, exclude = []) {
       return await super.getAll(query, exclude)
    }
    async checkIfItExists(condition,populate) {
        return await super.checkIfItExists(condition,populate);
    }

    //write your logic in here
};

export default new ${formattedName}Repo(model);`
}

function routeTemplate(routeFullPath, joiPath) {

    const allPaths = routeFullPath.split('/');
    const baseRoutePath = allPaths.length > 1 ? allPaths.slice(0, -1).map(item => '../').join(',') : './';
    const formattedName = allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);
    return `import express from 'express';
import ${formattedName} from '${baseRoutePath=="./"?"":baseRoutePath}../controller/${routeFullPath}.js';
import ${formattedName}Schema from '${baseRoutePath=="./"?"":baseRoutePath}../validators/Joi/schemas/${routeFullPath}.js';
import valMiddleware from '${baseRoutePath=="./"?"":baseRoutePath}../validators/Joi/middleware.js';
    
const router = express.Router();
    
router.get('/', ${formattedName}.getAll);

router.get('/:id', ${formattedName}.get);

router.put('/:id',valMiddleware(${formattedName}Schema.update${formattedName}), ${formattedName}.update);

router.post('/',valMiddleware(${formattedName}Schema.add${formattedName}), ${formattedName}.insert);

router.delete('/:id', ${formattedName}.delete);

export default router;`
}

function joiSchemaTemplate(joiPath) {
    const allPaths = joiPath.split('/');
    const formattedName = allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);
    return `import Joi from 'joi';

const add${formattedName} = Joi.object().keys({
       
});

const update${formattedName} = Joi.object().keys({
       
});

const statusChange = Joi.object().keys({
       
});

export default {
    add${formattedName},
    update${formattedName},
    statusChange
};`
}

function baseRouteTemplate(code, routePath) {
    const hRegExp = new RegExp('export default', 'i');
    const hblock = `import ${routePath.split('/').slice(-1)[0]}Route from '../src/routes/${routePath}';
    
export default`
    code = code.replace(hRegExp, hblock);
    return code.replace(new RegExp('\\};?', 'i'), `    server.use('/api/${routePath.split('/').slice(-1)[0]}',${routePath.split('/').slice(-1)[0]}Route);    
};`)
}
module.exports = {
    modelTemplate,
    servcieTemplate,
    controllerTemplate,
    routeTemplate,
    interfaceTemplate,
    joiSchemaTemplate,
    baseRouteTemplate
}