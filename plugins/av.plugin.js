const fp = require("fastify-plugin");
const NodeClam = require("clamscan");

async function clamav(fastify, opts) {
    const clamscan = await new NodeClam().init({
        removeInfected: true,
        debugMode: true,
        preference: 'clamscan'
    });

    fastify.decorate('clamav', clamscan);
}

module.exports = fp(clamav, { fastify: "4.x", name: "clamav" });