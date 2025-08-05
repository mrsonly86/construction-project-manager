"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Implement worker routes
router.get('/', (req, res) => res.json({ message: 'Workers route' }));
exports.default = router;
//# sourceMappingURL=workers.js.map