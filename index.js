const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
  console.log('中间一 Before calling next()');
  ctx.foo = 'hello!';
  await next();
  console.log('中间一 After calling next()');
})

app.use(async (ctx, next) => {
  console.log('中间二 Before calling next()');
  ctx.foo = 'hello!';
  await next();
  console.log('中间二 After calling next()');
  await next();
})

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')