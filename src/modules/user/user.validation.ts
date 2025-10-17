import z from "zod";
class UserValidation {
    updateInfoUser = z.strictObject({
        fullName: z.string().min(3).max(50).optional(),
        phoneNumber: z.string().min(11).max(11).optional(),
        gender: z.enum(["male", "female"]).optional(),
    }).refine((data) => data.fullName || data.phoneNumber || data.gender, {
        message: "At least one field is required",
    });

    resetPassword = z.strictObject({
        oldPassword: z.string().min(6).max(50),
        newPassword: z.string().min(6).max(50),
        confirmPassword: z.string().min(6).max(50),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
    });
    editEmail = z.strictObject({
        email: z.email(),
    });
    confirmEditEmail = z.strictObject({
        otp: z.string().regex(/^[0-9]{5}$/),
    });

    confirm2VerifyEmail = z.strictObject({
        otp: z.string().regex(/^[0-9]{5}$/),
    });
    sendTag = z.strictObject({
        idSendTag: z.string(),
    });
    
}
export default new UserValidation();