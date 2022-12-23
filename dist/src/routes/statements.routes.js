"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementRouter = void 0;
var express_1 = require("express");
var CreateStatementController_1 = require("../modules/statements/useCases/createStatement/CreateStatementController");
var GetBalanceController_1 = require("../modules/statements/useCases/getBalance/GetBalanceController");
var GetStatementOperationController_1 = require("../modules/statements/useCases/getStatementOperation/GetStatementOperationController");
var ensureAuthenticated_1 = require("../shared/infra/http/middlwares/ensureAuthenticated");
var statementRouter = express_1.Router();
exports.statementRouter = statementRouter;
var getBalanceController = new GetBalanceController_1.GetBalanceController();
var createStatementController = new CreateStatementController_1.CreateStatementController();
var getStatementOperationController = new GetStatementOperationController_1.GetStatementOperationController();
statementRouter.use(ensureAuthenticated_1.ensureAuthenticated);
statementRouter.get('/balance', getBalanceController.execute);
statementRouter.post('/deposit', createStatementController.execute);
statementRouter.post('/withdraw', createStatementController.execute);
statementRouter.get('/:statement_id', getStatementOperationController.execute);