// eslint-disable-next-line @typescript-eslint/no-var-requires
const { default: axios } = require('axios');

import { HttpFunction } from '@google-cloud/functions-framework';
import { ResponseCodeEnum } from '@dynamicideas/base-types';
import { MethodEnum } from './type/method.type';
import HandlerManager from './managers/handler.manager';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const entryPoint: HttpFunction = async (request: any, response: any) => {
  const projectName = '[ProjectName]';

  // Handle CORS for preflight request: https://cloud.google.com/functions/docs/samples/functions-http-cors#functions_http_cors-nodejs.
  console.log(
    projectName,
    'INDEX request.path:',
    request.path,
    ', request.method:',
    request.method,
    ', request.headers:',
    JSON.stringify(request.headers),
    ', request.query:',
    JSON.stringify(request.query),
    ', request.body:',
    JSON.stringify(request.body)
  );

  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Headers', '*');
  response.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  response.set('Access-Control-Max-Age', '3600');

  if (request.method === MethodEnum.Options) {
    response.status(204).send('');

    return;
  }

  let result;
  const route = request.path;
  const ipAddress =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  const {
    authorization: fromToken,
    productid: productId,
    recaptchatoken: reCaptchaToken
  } = request.headers;

  console.log(
    projectName,
    'INDEX IP:',
    ipAddress,
    ', fromToken:',
    fromToken,
    ', productId:',
    productId,
    ', reCaptchaToken:',
    reCaptchaToken
  );

  const { method } = request;

  if (
    method === MethodEnum.Post ||
    method === MethodEnum.Put ||
    method === MethodEnum.Delete
  ) {
    if (!reCaptchaToken) throw new Error('reCAPTCHA is required.');

    const reCaptchaUrl = `${process.env.GOOGLE_RECAPTCHA_URL}?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`;
    const reCaptchaResponse = (await axios.post(reCaptchaUrl)).data;

    console.log(
      projectName,
      'INDEX reCaptchaResponse.success:',
      reCaptchaResponse.success,
      ', reCaptchaResponse.score:',
      reCaptchaResponse.score,
      ', reCaptchaResponse.error-codes:',
      JSON.stringify(reCaptchaResponse['error-codes'])
    );

    if (!reCaptchaResponse.success)
      throw new Error("Sorry, you don't seem like a human being.");
  }

  try {
    const handler = new HandlerManager().getHandler(route, method);

    if (!handler) throw new Error('No handler found');

    if (method === MethodEnum.Get)
      result = await handler.handle({
        requestData: request.query,
        ipAddress
      });
    else
      result = await handler.handle({
        requestData: request.body,
        ipAddress
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(projectName, 'INDEX error:', error);
    result = { code: -1, message: error.message ?? error };
  }

  console.log(
    projectName,
    'INDEX route:',
    route,
    ', result:',
    JSON.stringify(result)
  );

  response.send(result ?? { code: ResponseCodeEnum.Success });
};
