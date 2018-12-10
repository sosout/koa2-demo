/**
 * 一个 koa 的路由中间件
 */
const methods = [
  'GET',
  'POST',
  'PUT',
  'DELETE'
];

/**
 * 路由类
 */
class Router {
  /**
   * 生成 Router 类对象
   * 
   * @example
   * 
   * ``` javascript
   * const app = new Koa();
   * const router = new Router();
   * 
   * app.use(router.middleware());
   * ```
   * 
   * @constructor
   */
  constructor() {
    const rm = this.routesMap = new Map();

    methods.forEach((method) => {
      rm.set(method, new Map())
    });
  }

  /**
   * 注册路由
   * 
   * @param {string} method HTTP方法名(GET|POST)
   * @param {RegExp} pattern 路由的匹配模式
   * @param {Function} handler 路由的处理函数
   */
  register(method, pattern, handler) {
    let routes = this.routesMap.get(method);
    if (!routes) {
      throw new Error('该HTTP方法不受支持');
    }
    routes.set(pattern, handler)
  }

  /**
   * 通过请求地址匹配一个处理函数
   * 
   * @param {string} method HTTP请求方法
   * @param {string} url 请求的URL地址
   * @param {Object} ctx Koa上下文对象
   * @returns {Function} 路由处理函数
   */
  matchHandler(method, url, ctx) {
    let routes = this.routesMap.get(method);

    // 路由映射不存在（没实现该HTTP方法）
    if (!routes) {
      return null;
    }
    for (let [key, value] of routes) {
      let matchs;
      if (matchs = key.exec(url)) {
        // 将匹配到的路径参数添加到`ctx`的`params`属性，以便路由处理函数使用
        ctx.params = matchs.slice(1);
        return value;
      }
    }
    return null;
  }
  /**
   * 生成Koa中间件函数以供Koa使用
   * 
   * @returns {Function} Koa中间件函数
   */
  middleware() {
    // 返回一个供Koa使用的中间件函数
    return async (ctx, next) => {
      const method = ctx.request.method;
      const url = ctx.request.url;
      const handler = this.matchHandler(method, url, ctx);
      if (handler) {
        await handler(ctx);
      } else {
        // handler对象为空，则说明没有匹配的路由，响应404状态
        ctx.status = 404;
        ctx.body = '404 Not Found!\n';
      }
      // 调用next函数以继续执行其他中间件
      await next();
    }
  }
}

// 为每一个 HTTP 方法生成相应的函数
methods.map((method) => {
  Router.prototype[method.toLowerCase()] = function(pattern, handler) {
    this.register(method, pattern, handler)
  }
});

module.exports = Router;