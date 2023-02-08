const cors = require("@fastify/cors");
const fastify = require("fastify")({ logger: true });
const multipart = require("@fastify/multipart");

fastify.register(cors, {});
fastify.register(multipart, {});
fastify.register(require("./plugins/av.plugin"));
fastify.register(require("./routes/upload.routes"));

const start = async () => {
    try {
        await fastify.listen({ port: 3002 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();