"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// TODO: Implement work item routes
router.get('/', (req, res) => res.json({ message: 'Work items route' }));
exports.default = router;
//# sourceMappingURL=workItems.js.map