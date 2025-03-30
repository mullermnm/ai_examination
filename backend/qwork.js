const fs = require('fs');
const path = require('path');
const joiGenerator = require('./qwork-joi');
// const serviceCode = require('./qwork-serviceCode');
const { modelTemplate, servcieTemplate, controllerTemplate, interfaceTemplate, joiSchemaTemplate, routeTemplate, baseRouteTemplate } = require('./qwork-template');
const commands = process.argv;
//process.cwd();
//process.chdir();
//process.config();
// fs.open('myfile', 'wx', (err, fd) => {
//     if (err) {
//         if (err.code === 'EEXIST') {
//             console.error('myfile already exists');
//             return;
//         }

//         throw err;
//     }

//     writeMyData(fd);
// });
const modelPath = path.normalize(commands[1] + '/../src/models');
const servicePath = path.normalize(commands[1] + '/../src/services');
const controllerPath = path.normalize(commands[1] + '/../src/controller');
const routePath = path.normalize(commands[1] + '/../src/routes');
const interfacePath = path.normalize(commands[1] + '/../src/interface');
const joiSchemaPath = path.normalize(commands[1] + '/../src/validators/Joi/schemas');
const baseRoutePath = __dirname + '/bootstrap/routes.js';

switch (commands[2]) {
    case '--create':

        const modelFolderExists = fs.existsSync(modelPath);
        if (modelFolderExists) {

            if (commands[3].split('/').length > 1) {
                try {
                    fs.mkdirSync(modelPath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                    fs.mkdirSync(servicePath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                    fs.mkdirSync(controllerPath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                    fs.mkdirSync(routePath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                    fs.mkdirSync(interfacePath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                    fs.mkdirSync(joiSchemaPath + `/${commands[3].split('/').slice(0,-1).join('/')}`);
                } catch (error) {
                    // if (error.code == 'EEXIST') return console.error('file already exists');
                    // return console.error('encounterd errors while creating the files check if you have permission.')
                }
                fs.writeFileSync(modelPath + `/${commands[3]}.js`, modelTemplate(commands[3].split('/').slice(-1)[0]));
                fs.writeFileSync(servicePath + `/${commands[3]}.js`, servcieTemplate(commands[3]));
                fs.writeFileSync(controllerPath + `/${commands[3]}.js`, controllerTemplate(commands[3]));
                fs.writeFileSync(routePath + `/${commands[3]}.js`, routeTemplate(commands[3]));
                fs.writeFileSync(interfacePath + `/${commands[3]}.js`, interfaceTemplate(commands[3]));
                fs.writeFileSync(joiSchemaPath + `/${commands[3]}.js`, joiSchemaTemplate(commands[3]));
                fs.writeFileSync(baseRoutePath, baseRouteTemplate(fs.readFileSync(baseRoutePath, 'utf-8'), commands[3]));
            } else {
                fs.writeFileSync(modelPath + `/${commands[3]}.js`, modelTemplate(commands[3].split('/').slice(-1)[0]));
                fs.writeFileSync(servicePath + `/${commands[3]}.js`, servcieTemplate(commands[3]));
                fs.writeFileSync(controllerPath + `/${commands[3]}.js`, controllerTemplate(commands[3]));
                fs.writeFileSync(routePath + `/${commands[3]}.js`, routeTemplate(commands[3], joiSchemaPath + `/${commands[3]}.js`));
                fs.writeFileSync(interfacePath + `/${commands[3]}.js`, interfaceTemplate(commands[3]));
                fs.writeFileSync(joiSchemaPath + `/${commands[3]}.js`, joiSchemaTemplate(commands[3]));
                fs.writeFileSync(baseRoutePath, baseRouteTemplate(fs.readFileSync(baseRoutePath, 'utf-8'), commands[3]));
            }
            console.info('total of 5 files created !!');
        } else console.warn('project not initialized proporley !!');
        break;
    case '--joi':
        fs.writeFileSync(joiSchemaPath + `/${commands[3]}.js`, joiGenerator(commands[3]));
        break;
    case '--service':
        serviceCode();
        break;
    default:
        console.log('command not found', commands)
}