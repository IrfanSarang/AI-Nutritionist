import { Request, Response } from 'express';
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfiles: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const fetchData: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=userController.d.ts.map