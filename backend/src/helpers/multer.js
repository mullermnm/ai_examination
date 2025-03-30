import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const storage = (fdestination) => {
    return multer.diskStorage({
        destination: function(req, file, next) {
            fdestination = fdestination || file.fieldname;
            next(null, "./storage/" + fdestination);
        },
        filename: function(req, file, next) {
            next(null, uuidv4() + path.extname(file.originalname));
        },
    });
}

const fileFilter = function(req, file, next) {
    if (file.mimetype.startsWith("image/")) next(null, true);
    else next({ message: "format not supported" });
};

const saveFileToBody = async(req, fieldname) => {
    try {

        if (req.file) {
            req.body = {
                [fieldname]: req.file,
                ...req.body
            };
        } else if (req.files && req.files.length) {
            req.body = {
                [fieldname]: req.files,
                ...req.body,
            };
        }
        console.log(req.body)
        return {
            error: false,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

const saveMultipleFieldsToBody = async(req, fields) => {
    try {
        Object.keys(req.files).forEach(key => {
            req.files[key].length == 1 ? req.body[key] = req.files[key][0] : req.body[key] = req.files[key]
        })
        return {
            error: false,
        };
    } catch (err) {
        return {
            error: true,
            message: err.message,
        };
    }
};

export default function uploadFile(destination) {
    return {
        single: (fieldname) => {
            return async(req, res, next) => {
                const customNext = async() => {
                    const { error } = await saveFileToBody(req, fieldname);
                    if (!error) next();
                };

                await multer({ storage: storage(destination), fileFilter })
                    .single(fieldname).bind(null, req, res, customNext)();
            };

        },
        array: (fieldname, maxcount) => {
            return async(req, res, next) => {
                const customNext = async() => {
                    const { error } = await saveFileToBody(req, fieldname);
                    if (!error) next();
                };
                return multer({ storage: storage(destination), fileFilter })
                    .array(fieldname, maxcount)
                    .bind(null, req, res, customNext)();
            };
        },
        /**
         * @returns {Function} Returns middleware that processes multiple files associated with the given form fields.The Request object will be populated with a files object which maps each field name to an array of the associated file information objects.

          @param fields Array of Field objects describing multipart form fields to process, with name and maxCount fields.

          @throws MulterError('LIMIT_UNEXPECTED_FILE') if more than maxCount files are associated with fieldName for any field.

         */

        fields: (fields) => {
            return async(req, res, next) => {
                const customNext = async() => {
                    const { error } = await saveMultipleFieldsToBody(req, fields);
                    if (!error) next();
                };
                return multer({ storage: storage(destination), fileFilter })
                    .fields(fields)
                    .bind(null, req, res, customNext)();
            };
        },
    };
}