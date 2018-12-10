const Koa = require('koa')
const fs = require('fs')
const Router = require('koa-router')

const app = new Koa()
const home = new Router()

// 子路由1
home.get('/', async (ctx) => {
  
})

app.use(async (ctx) => {
  let url = ctx.request.url
  let html = await route( url )
  ctx.body = html
})

app.listen(3000)

console.log('[demo] start-quick is starting at port 3000')