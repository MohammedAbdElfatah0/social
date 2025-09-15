import { z } from "zod";
import { RegisterDto } from "./auth.dto";
import { GENDER } from "../../utils";

export const registerSchema = z.object<RegisterDto>({

    fullName: z.string().min(2).max(20) as unknown as string,
    email: z.email() as unknown as string,
    password: z.string().min(6).max(20) as unknown as string,
    phoneNumber: z.string().min(11).max(11) as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER,
});