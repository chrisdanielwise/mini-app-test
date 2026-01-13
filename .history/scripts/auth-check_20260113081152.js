"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegram_1 = require("@/lib/auth/telegram");
var auth_service_1 = require("@/lib/services/auth.service");
var db_1 = require("@/lib/db");
function runSmokeTest() {
    return __awaiter(this, void 0, void 0, function () {
        var mockUser, token, payload, testUser, magicToken, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🚀 [System_Audit] Starting Institutional Auth Health Check...");
                    // 1. Verify Environment
                    if (!process.env.JWT_SECRET || !process.env.TELEGRAM_BOT_TOKEN) {
                        console.error("❌ [Audit_Fail] Missing Environment Variables.");
                        return [2 /*return*/];
                    }
                    console.log("✅ [Audit_Pass] Environment Variables Found.");
                    mockUser = { userId: "test-uuid-123", telegramId: "987654321", role: "admin", isStaff: true };
                    return [4 /*yield*/, (0, telegram_1.createJWT)(mockUser)];
                case 1:
                    token = _a.sent();
                    return [4 /*yield*/, (0, telegram_1.verifyJWT)(token)];
                case 2:
                    payload = _a.sent();
                    if ((payload === null || payload === void 0 ? void 0 : payload.sub) === "test-uuid-123") {
                        console.log("✅ [Audit_Pass] JWT Cryptography & 'sub' Claim Standardized.");
                    }
                    else {
                        console.error("❌ [Audit_Fail] JWT Payload Mismatch.");
                    }
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 10, , 11]);
                    return [4 /*yield*/, db_1.default.user.findFirst()];
                case 4:
                    testUser = _a.sent();
                    if (!testUser) return [3 /*break*/, 8];
                    return [4 /*yield*/, auth_service_1.AuthService.generateMagicToken(testUser.telegramId.toString())];
                case 5:
                    magicToken = _a.sent();
                    if (!magicToken) return [3 /*break*/, 7];
                    console.log("\u2705 [Audit_Pass] MagicToken Table linked to User ".concat(testUser.id, "."));
                    // Cleanup the test token
                    return [4 /*yield*/, db_1.default.magicToken.delete({ where: { token: magicToken } })];
                case 6:
                    // Cleanup the test token
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    console.warn("⚠️ [Audit_Skipped] No user found in DB to test MagicLink association.");
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_1 = _a.sent();
                    console.error("❌ [Audit_Fail] Database Relation Error:", err_1);
                    return [3 /*break*/, 11];
                case 11:
                    console.log("🏁 [System_Audit] Health Check Complete.");
                    return [2 /*return*/];
            }
        });
    });
}
runSmokeTest();
