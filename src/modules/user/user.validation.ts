import z from "zod";
class UserValidation {
    updateInfoUser = z.object({
        fullName: z.string().min(3).max(50).optional(),
        phoneNumber: z.string().min(11).max(11).optional(),
        gender: z.enum(["male", "female"]).optional(),
    }).refine((data) => data.fullName || data.phoneNumber || data.gender, {
        message: "At least one field is required",
    });

    resetPassword = z.object({
        oldPassword: z.string().min(6).max(50),
        newPassword: z.string().min(6).max(50),
        confirmPassword: z.string().min(6).max(50),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
    });
}
export default new UserValidation();