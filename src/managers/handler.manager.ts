import { BaseHandler } from '../type/base.type';
import { MethodEnum } from '../type/method.type';
import DemoHandler from '../handlers/demo.handler';

export default class HandlerManager {
  #handlerMap = {
    ['path']: this.#getDemoHandler
  };

  getHandler(route: string, method: MethodEnum): BaseHandler | undefined {
    console.log(
      'HandlerManager.getHandler() route:',
      route,
      ', method:',
      method
    );

    return this.#handlerMap[route]?.call(this, method);
  }

  #getDemoHandler(method: MethodEnum): BaseHandler | undefined {
    if (method === MethodEnum.Get) return new DemoHandler();
  }
}
