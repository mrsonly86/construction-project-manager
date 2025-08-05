import { Router } from 'express';
import * as projectController from '../controllers/projectController';

const router = Router();

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

export default router;