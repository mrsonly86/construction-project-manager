"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Implement material routes
router.get('/', (req, res) => res.json({ message: 'Materials route' }));
exports.default = router;
//# sourceMappingURL=materials.js.map