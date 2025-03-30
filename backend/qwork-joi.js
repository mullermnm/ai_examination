const mongoose = require("mongoose");

module.exports = function JoiValidationGenerator(modelName = "") {
  const {model} = require(`./src/models/${modelName}.js`);
  let paths = []
  // console.info({name, modelName, model},model.schema)
  model.schema.eachPath((pathname, schematype) => {
    // Prints twice:
    // name SchemaString { ... }
    // registeredAt SchemaDate { ... }
    if (
      [
        "_id",
        "id",
        "unionId",
        "registeredBy",
        "modifiedBy",
        "status",
        "updatedAt",
        "createdAt",
        "__v",
      ].includes(schematype.path)
    )
      return;
    let tree = {};

    function getInstance(SCHT) {
      return SCHT.instance.trim();
    }

    let cycle = 0;
    let heirarchy = 0;

    function listAllPaths(SCHT, hasArrayParent, period) {
      const key = (Math.random() * Math.pow(10, 8)).toFixed();
      if (getInstance(SCHT) == "Array") {
        Object.keys(tree).length == 0
          ? (tree = {
              path: SCHT.path,
              type: getInstance(SCHT),
              key,
              childrens: [],
            })
          : getArrayName(SCHT, cycle, key);
        if (SCHT.schema) {
          Object.keys(SCHT.schema.paths).forEach((path, index) => {
            if (index == 0) {
              cycle++;
            }
            if (index == Object.keys(SCHT.schema.paths).length - 1) {
              cycle--;
            }
            // console.log(SCHT.schema.paths[path].tree);
            if (SCHT.schema.paths[path].path != "_id") {
              heirarchy++;
              listAllPaths(SCHT.schema.paths[path], true, cycle);
            }
          });
        }
      }
      if (getInstance(SCHT) == "Number") {
        // if (hasArrayParent) tree.push(`${tree[period-1]}.${SCHT.path}`);
        console.log(SCHT.options.type);
      }
      if ((getInstance(SCHT) == "String") || (getInstance(SCHT) == 'ObjectID')) {
        if (hasArrayParent) {
          if (SCHT.path.includes(".") && SCHT.path.split(".").length > 0) {
            SCHT.path.split(".").forEach((item, index) => {
              if (index == 0) {
                tree.childrens.push({
                  path: item,
                  key,
                  type: "Object",
                  childrens: [],
                  options: {},
                });
              } else {
                tree.childrens
                  .find((child) => child.key == key)
                  .childrens.push({
                    path: SCHT.path,
                    type: getInstance(SCHT),
                    options: SCHT.options,
                  });
              }
            });
          } else
            cycle == 1
              ? tree.childrens.push({
                  path: SCHT.path,
                  type: getInstance(SCHT),
                  options: SCHT.options,
                })
              : {};
        } else
          tree = {
            path: SCHT.path,
            key,
            type: getInstance(SCHT),
            options: SCHT.options,
          };
      }
      if (getInstance(SCHT) == "Boolean") {
        if (hasArrayParent) {
          if (SCHT.path.includes(".") && SCHT.path.split(".").length > 0) {
            SCHT.path.split(".").forEach((item, index) => {
              if (index == 0) {
                tree.childrens.push({
                  path: item,
                  key,
                  type: "Object",
                  childrens: [],
                  options: {},
                });
              } else {
                tree.childrens
                  .find((child) => child.key == key)
                  .childrens.push({
                    path: SCHT.path,
                    type: getInstance(SCHT),
                    options: SCHT.options,
                  });
              }
            });
          } else
            cycle == 1
              ? tree.childrens.push({
                  path: SCHT.path,
                  type: getInstance(SCHT),
                  options: SCHT.options,
                })
              : {};
        } else
          tree = {
            path: SCHT.path,
            key,
            type: getInstance(SCHT),
            options: SCHT.options,
          };
      }
    }
    listAllPaths(schematype);
    function getArrayName(SCHT, cycle, key) {
      if (SCHT.path.includes(".") && SCHT.path.split(".").length > 0) {
        SCHT.path.split(".").forEach((item, index) => {
          if (index == 0) {
            tree.childrens.push({
              path: item,
              key,
              type: "Object",
              childrens: [],
              options: {},
            });
          } else {
            tree.childrens
              .find((child) => child.key == key)
              .childrens.push({
                path: SCHT.path,
                type: getInstance(SCHT),
                options: SCHT.options,
              });
          }
        });
      }
    }
    Object.keys(tree).length > 0 ? paths.push(tree) : "";
    // console.log(pathname, schematype.instance, schematype.options);
  });
  const joiOption = {};
  paths.forEach((item) => {
    if (
      !(
        item.options &&
        item.options.__meta &&
        item.options.__meta.joi !== false
      )
    ) {
      if (item.path.includes(".")) {
        console.log("one");
      } else
        joiOption[item.path] = `Joi.${item.type.toLowerCase()}()${
          item.options && item.options.required ? ".required()" : ""
        }`;
    }
  });
  const allPaths = modelName.split("/");
  const formattedName =
    allPaths.slice(-1)[0][0].toUpperCase() + allPaths.slice(-1)[0].slice(1);

  function getTemplate(key, obj) {
    return `${key}:${obj[key]}`;
  }
  return `import Joi from 'joi';

const add${formattedName} = Joi.object().keys({${Object.keys(joiOption).map(
    (key) => getTemplate(key, joiOption)
  )}});

const update${formattedName} = Joi.object().keys({${Object.keys(joiOption).map(
    (key) => getTemplate(key, joiOption)
  )}});

const statusChange = Joi.object().keys({ status: Joi.string().required() });

export default {
    add${formattedName},
    update${formattedName},
    statusChange
};`;
};
