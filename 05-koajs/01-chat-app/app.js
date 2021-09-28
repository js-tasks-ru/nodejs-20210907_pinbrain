const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
const subscribers = new Map();

router.get('/subscribe', async (ctx, next) => {
    const subId = Math.random();
    ctx.res.on('close', () => {
        subscribers.delete(subId);
    });
    const msg = await new Promise(resolve => subscribers.set(subId, resolve));
    ctx.body = msg;
});

router.post('/publish', async (ctx, next) => {
    const msg = ctx.request.body.message;
    if(!msg) ctx.throw(400, 'no message found')
    subscribers.forEach(resolve => resolve(msg));
    ctx.body = msg;
});

app.use(router.routes());

module.exports = app;
