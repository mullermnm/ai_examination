const fs = require('fs');
const path = require('path');
import TestModel from './src/models/test';

const testM = new TestModel().getInstance();

const servicePath = path.normalize(__dirname + '/src/services/test.js');
module.exports = async function() {
    const uniquef = [];
    testM.schema.eachPath((pathname, schematype) => { schematype.options && schematype.options.unique ? uniquef.push(pathname) : '' });
    const test = fs.readFileSync(servicePath, { encoding: 'utf-8' });
    console.log(test);
    const regExp = new RegExp('[\w\d\s]*async add[\\s]*\\([\\w\\d\\s,]*\\)\\s*\\{', 'i');
    const block = `async add (user,data){
        const {isPresent}=await this.repo.checkIfItExists({${uniquef[0]}:data.${uniquef[0]}});
        if(isPresent) return new this.errorResponse()`
    console.log(test.replace(regExp, block));
    console.log(regExp.test(test));

    console.log(uniquef);
    fs.writeFileSync(servicePath, test.replace(regExp, block))
}