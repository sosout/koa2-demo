const http = require('http');

const Koa = require('koa');
const Router = require('./router');

const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

describe('测试开始', () => {

  it('测试路由工作是否正常', (done) => {
    const app = new Koa();
    const router = new Router();
    router.get(/^\/$/, async (ctx) => {
      ctx.body = { msg: 'home' };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.msg).to.equal('home');
        done();
      });
  });

  it('测试GET方法请求是否正常', (done) => {
    const app = new Koa();
    const router = new Router();
    router.get(/^\/hello$/, async (ctx) => {
      ctx.body = { msg: 'hello' };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
      .get('/hello')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.msg).to.equal('hello');
        done();
      });
  });

  it('测试POST方法请求是否正常', (done) => {
    const app = new Koa();
    const router = new Router();
    router.post(/^\/hello$/, async (ctx) => {
      ctx.body = { msg: 'hello' };
    });
    app.use(router.middleware());
    
    request(http.createServer(app.callback()))
      .post('/hello')
      .expect(200)
      .end((err, res) => {
        if(err) done(err);
        expect(res.body.msg).to.equal('hello');
        done();
      });
  });

  it('测试PUT方法请求是否正常', (done) => {
    const app = new Koa();
    const router = new Router();
    router.put(/^\/put$/, async (cxt) => {
      cxt.body = { msg: 'ok' };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
    .put('/put')
    .expect(200)
    .end((err, res) => {
      if (err) done(err);
      expect(res.body.msg).to.equal('ok');
      done();
    })
  })

  it('测试DELETE方法请求是否正常', (done) => {
    const app = new Koa();
    const router = new Router();
    router.put(/^\/delete$/, async (cxt) => {
      cxt.body = { msg: 'ok' };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
    .put('/delete')
    .expect(200)
    .end((err, res) => {
      if (err) done(err);
      expect(res.body.msg).to.equal('ok');
      done();
    })
  })

  it('测试路径参数是否传递', (done) => {
    const app = new Koa();
    const router = new Router();
    router.get(/^\/param\/(.+)/, async (ctx) => {
      ctx.body = { msg: ctx.params[0] };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
      .get('/param/hello')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.msg).to.equal('hello');
        done();
      });
  });

  it('测试通过GET请求POST方法', (done) => {
    const app = new Koa();
    const router = new Router();
    router.post(/^\/post$/, async (ctx) => {
      ctx.body = { msg: 'hello' };
    });
    app.use(router.middleware());

    request(http.createServer(app.callback()))
      .get('/post')
      .expect(404)
      .end((err) => {
        if (err) done(err);
        done();
      });
  });

  it('测试请求未定义的路由', (done) => {
    const app = new Koa();
    const router = new Router();
    app.use(router.middleware());

    request(http.createServer(app.callback()))
      .get('/404')
      .expect(404)
      .end((err) => {
        if (err) done(err);
        done();
      });
  });

  it('测试中间件跳转', (done) => {
    const app = new Koa();
    const router = new Router();
    router.get(/^\/test$/, async (ctx, next) => {
      ctx.body.baz = 'baz';
    })
    app.use(async (ctx, next) => {
      ctx.body = { foo: 'foo' }
      await next();
    })
    app.use(router.middleware());
    app.use(async (ctx, next) => {
      ctx.body.bar = 'bar';
      await next();
    });

    request(http.createServer(app.callback()))
      .get('/test')
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        expect(res.body.foo).to.equal('foo');
        expect(res.body.bar).to.equal('bar');
        expect(res.body.baz).to.equal('baz');
        done();
      });
  });
});