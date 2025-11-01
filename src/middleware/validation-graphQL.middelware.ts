import { ZodType } from "zod";
import { BadRequestException } from "../utils";

export const isValidationGraph = (shema: ZodType, agrs: any) => {
    let data = { ...agrs }
    const result = shema.safeParse(data);
    if (result.success == false) {
        let errMessage = result.error.issues.map((issues) => ({
            path: issues.path[0] as string,
            message: issues.message
        }));
        throw new BadRequestException("Validation error", errMessage);
    }

};
