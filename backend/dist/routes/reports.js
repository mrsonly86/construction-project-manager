"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Implement report routes
router.get('/', (req, res) => res.json({ message: 'Reports route' }));
exports.default = router;
//# sourceMappingURL=reports.js.map