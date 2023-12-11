// eslint-disable-next-line @typescript-eslint/no-var-requires
const dayJs = require('dayjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const utc = require('dayjs/plugin/utc');

import { BaseResponseType } from '@dynamicideas/official-website-routes';
import { HandlerPropertyDataType } from './handler.type';

export abstract class BaseHandler {
  constructor() {
    this.init();
  }

  init() {
    dayJs.extend(utc);
  }

  abstract handle(params: HandlerPropertyDataType): Promise<BaseResponseType>;
}

export abstract class BaseManager {
  constructor() {
    this.init();
  }

  init() {
    dayJs.extend(utc);
  }
}
