// eslint-disable-next-line @typescript-eslint/no-var-requires
// const dayJs = require('dayjs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { v4: uuidV4 } = require('uuid');

import { ResponseCodeEnum } from '@dynamicideas/base-types';
import { BaseHandler } from '../type/base.type';
import { HandlerPropertyDataType } from '../type/handler.type';
import { BaseResponseType } from '@dynamicideas/official-website-routes';

export default class DemoHandler extends BaseHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(params: HandlerPropertyDataType): Promise<BaseResponseType> {
    return { code: ResponseCodeEnum.Success };
  }
}
