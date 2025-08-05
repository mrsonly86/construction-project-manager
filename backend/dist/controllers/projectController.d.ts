import { Request, Response } from 'express';
export declare const getAllProjects: (req: Request, res: Response) => Promise<void>;
export declare const createProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProjectById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProjectWorkItems: (req: Request, res: Response) => Promise<void>;
export declare const createProjectWorkItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=projectController.d.ts.map