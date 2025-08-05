"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController = __importStar(require("../controllers/projectController"));
const router = (0, express_1.Router)();
// GET /api/projects - Get all projects
router.get('/', projectController.getAllProjects);
// POST /api/projects - Create new project
router.post('/', projectController.createProject);
// GET /api/projects/:id - Get project by ID
router.get('/:id', projectController.getProjectById);
// PUT /api/projects/:id - Update project
router.put('/:id', projectController.updateProject);
// DELETE /api/projects/:id - Delete project
router.delete('/:id', projectController.deleteProject);
// GET /api/projects/:projectId/work-items - Get work items for project
router.get('/:projectId/work-items', projectController.getProjectWorkItems);
// POST /api/projects/:projectId/work-items - Create work item for project
router.post('/:projectId/work-items', projectController.createProjectWorkItem);
exports.default = router;
//# sourceMappingURL=projects.js.map