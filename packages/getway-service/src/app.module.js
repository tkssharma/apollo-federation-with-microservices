'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require('@nestjs/common');
var graphql_1 = require('@nestjs/graphql');
var gateway_1 = require('@apollo/gateway');
var jsonwebtoken_1 = require('jsonwebtoken');
var handleAuth = function (_a) {
  var req = _a.req;
  var decoded = jsonwebtoken_1.verify(req.headers.authorization, 'privateKey');
  return { userId: decoded.userId, permissions: decoded.permissions };
};
var AppModule = /** @class */ (function () {
  function AppModule() {}
  AppModule = __decorate(
    [
      common_1.Module({
        imports: [
          graphql_1.GraphQLGatewayModule.forRoot({
            server: {
              cors: true,
              playground: true,
              context: handleAuth,
            },
            gateway: {
              buildService: function (_a) {
                var name = _a.name,
                  url = _a.url;
                return new gateway_1.RemoteGraphQLDataSource({
                  url: url,
                  willSendRequest: function (_a) {
                    var request = _a.request,
                      context = _a.context;
                    request.http.headers.set('userId', context.userId);
                    request.http.headers.set(
                      'permissions',
                      context.permissions,
                    );
                  },
                });
              },
              serviceList: [
                // list of services
                {
                  name: 'User',
                  url: 'http://127.0.0.1:3000/graphql-federated',
                },
                {
                  name: 'Pokemon',
                  url: 'http://127.0.0.1:3001/graphql-federated',
                },
              ],
            },
          }),
        ],
      }),
    ],
    AppModule,
  );
  return AppModule;
})();
exports.AppModule = AppModule;
