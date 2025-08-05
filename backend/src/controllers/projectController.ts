import { Request, Response } from 'express';
import { getDatabase } from '../utils/database';
import { v4 as uuidv4 } from 'uuid';

// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const projects = await db.all(`
      SELECT p.*, 
             COUNT(wi.id) as work_item_count,
             COALESCE(SUM(wi.design_quantity), 0) as total_design_quantity,
             COALESCE(SUM(wi.completed_quantity), 0) as total_completed_quantity
      FROM projects p
      LEFT JOIN work_items wi ON p.id = wi.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    // Calculate completion percentage for each project
    const projectsWithProgress = projects.map((project: any) => {
      const completionPercentage = project.total_design_quantity > 0 
        ? (project.total_completed_quantity / project.total_design_quantity) * 100 
        : 0;

      return {
        ...project,
        completionPercentage: Math.round(completionPercentage * 100) / 100
      };
    });

    res.json(projectsWithProgress);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Create new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, budget, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const db = getDatabase();
    const projectId = uuidv4();
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO projects (id, name, description, start_date, end_date, budget, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      projectId,
      name,
      description || null,
      startDate || null,
      endDate || null,
      budget ? parseFloat(budget) : null,
      status || 'PLANNING',
      now,
      now
    ]);

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [projectId]);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const project = await db.get('SELECT * FROM projects WHERE id = ?', [id]);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get work items for this project
    const workItems = await db.all('SELECT * FROM work_items WHERE project_id = ?', [id]);

    // Calculate completion percentage
    const totalDesignQuantity = workItems.reduce((sum: number, item: any) => sum + item.design_quantity, 0);
    const totalCompletedQuantity = workItems.reduce((sum: number, item: any) => sum + item.completed_quantity, 0);
    const completionPercentage = totalDesignQuantity > 0 ? (totalCompletedQuantity / totalDesignQuantity) * 100 : 0;

    const projectWithDetails = {
      ...project,
      workItems,
      completionPercentage: Math.round(completionPercentage * 100) / 100
    };

    res.json(projectWithDetails);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, budget, status } = req.body;
    const db = getDatabase();

    // Check if project exists
    const existingProject = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (startDate !== undefined) {
      updates.push('start_date = ?');
      values.push(startDate);
    }
    if (endDate !== undefined) {
      updates.push('end_date = ?');
      values.push(endDate);
    }
    if (budget !== undefined) {
      updates.push('budget = ?');
      values.push(budget ? parseFloat(budget) : null);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.run(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, values);

    const updatedProject = await db.get('SELECT * FROM projects WHERE id = ?', [id]);
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    const result = await db.run('DELETE FROM projects WHERE id = ?', [id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Get work items for project
export const getProjectWorkItems = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const db = getDatabase();

    const workItems = await db.all('SELECT * FROM work_items WHERE project_id = ? ORDER BY created_at ASC', [projectId]);
    res.json(workItems);
  } catch (error) {
    console.error('Error fetching work items:', error);
    res.status(500).json({ error: 'Failed to fetch work items' });
  }
};

// Create work item for project
export const createProjectWorkItem = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, unit, designQuantity, unitPrice, startDate, endDate } = req.body;

    if (!name || !unit || designQuantity === undefined || unitPrice === undefined) {
      return res.status(400).json({ 
        error: 'Name, unit, design quantity, and unit price are required' 
      });
    }

    const db = getDatabase();
    const workItemId = uuidv4();
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO work_items (id, project_id, name, description, unit, design_quantity, unit_price, start_date, end_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      workItemId,
      projectId,
      name,
      description || null,
      unit,
      parseFloat(designQuantity),
      parseFloat(unitPrice),
      startDate || null,
      endDate || null,
      now,
      now
    ]);

    const workItem = await db.get('SELECT * FROM work_items WHERE id = ?', [workItemId]);
    res.status(201).json(workItem);
  } catch (error) {
    console.error('Error creating work item:', error);
    res.status(500).json({ error: 'Failed to create work item' });
  }
};