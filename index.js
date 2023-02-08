const cors = require("@fastify/cors");
const fastify = require("fastify")({ logger: true });

fastify.register(cors, {});

fastify.register(require("@fastify/redis"), {
    url: "redis://127.0.0.1"
});

const start = async () => {
    try {
        await fastify.listen({ port: 3001 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

start();