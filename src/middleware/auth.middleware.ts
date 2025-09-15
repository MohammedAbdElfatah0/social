import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../utils/error";
import { ZodType } from "zod";

export const isValidation = (shema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        let data = { ...req.body, ...req.params, ...req.query }
        const result = shema.safeParse(data);
        if (result.success == false) {
            let errMessage = result.error.issues.map((issues) => ({
                path: issues.path[0] as string,
                message: issues.message
            }));
            throw new BadRequestException("Validation error", errMessage);
        }
    };
};