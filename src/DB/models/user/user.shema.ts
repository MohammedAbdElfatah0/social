import { Schema } from "mongoose";
import { IUser, SYS_ROLE, GENDER, USER_AGENT, sendEmail, decryptData } from "../../../utils";


export const userSchema = new Schema<IUser>({
    fristName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent === USER_AGENT.google) {
                return false;
            }
            return true;
        }
    },
    credentialUpdataAt: {
        type: Date,
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String,
        enum: SYS_ROLE,
        default: SYS_ROLE.user
    },
    gender: {
        type: String,
        enum: GENDER,
        default: GENDER.male
    },
    userAgent: {
        type: String,
        enum: USER_AGENT,
        default: USER_AGENT.local
    },
    otp: {
        type: String
    },
    otpExpiryAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

userSchema.virtual("fullName")
    .get(function () {
        return `${this.fristName} ${this.lastName}`;
    })
    .set(function (fullName: String) {
        this.fristName = fullName.split(" ")[0] as string;
        this.lastName = fullName.split(" ")[1] as string;
    });

userSchema.pre("save", async function (next) {
    if (this.isVerified) {
        return next();
    }
    if (this.isNew && this.userAgent !== USER_AGENT.google) {
        console.log(this);
        await sendEmail({
            to: this.email,
            subject: "Confirm your email",
            html: `
                            <h2>Confirm Your Account</h2>
                            <p>Hello,</p>
                            <p>Thanks for signing up! Please use the code below to confirm your email:</p>
                            <h3 style="color:blue;">${decryptData(this.otp!)}</h3>
                            <p>If you didn’t request this, ignore this email.</p>
                            `,

        });
        next();
    }

});