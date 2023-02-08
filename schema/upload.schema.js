const Joi = require("joi");

const filePathSchema = {
    file_path: Joi.string().required().min(5)
}

module.exports = { filePathSchema }