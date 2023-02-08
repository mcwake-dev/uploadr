// upload.routes.js

const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const util = require("util");
const crypto = require("crypto");
const { pipeline } = require("stream");

const pump = util.promisify(pipeline);
const { validatorCompiler } = require("../utils/validatorCompiler.util");
const { filePathSchema } = require("../schema/upload.schema");

async function routes(fastify, options) {
    fastify.post("/api/upload", async (request, reply) => {
        const parts = request.parts();

        for await (const part of parts) {
            if (part.file) {
                const filePath = `${crypto.randomUUID()}${path.extname(part.filename)}`;
                await pump(part.file, fs.createWriteStream(`./quarantine/${filePath}`));
                const { isInfected } = await fastify.clamav.isInfected(`./quarantine/${filePath}`);

                if (isInfected) {
                    reply.status(400).send("File was detected as possible virus");
                } else {
                    reply.status(201).send({ filePath })
                }
            }
        }

        reply.status(201);
    });

    fastify.delete("/api/delete-file/:file_path", {
        schema: {
            params: Joi.object().keys({ ...filePathSchema })
        },
        validatorCompiler,
        preHandler: async (request, reply, done) => {
            const { file_path } = request.params;
            const fileExists = await fs.promises.stat(`./quarantine/${file_path}`);

            if (fileExists) {
                done();
            } else {
                reply.status(400).send("File does not exist");
            }
        }
    }, async (request, reply) => {
        const { file_path } = request.params;

        try {
            await fs.promises.unlink(`./quarantine/${file_path}`);
            reply.status(204);
        } catch (err) {
            if (err.errno === -2) {
                reply.status(204);
            } else {
                reply.status(400).send({ err });
            }
        }
    });
}

module.exports = routes;