import { Request, Response, NextFunction } from "express";
import { ConfirmAccountDto, LoginDto, RegisterDto } from "./auth.dto";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { BadRequestException, ConflictException, NotFoundException, comparePassword, sendEmail } from "../../utils";

class AuthService {

    // private dbService = new AbstractRepository<IUser>(User);
    private readonly userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor() { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        //TODO::: send email for confirmation and otp 
        //get data
        const registerDto: RegisterDto = req.body;

        //check user is exist
        const userExist = await this.userRepository.exist({ email: registerDto.email });

        if (userExist) {
            return next(new ConflictException("User already exist"));
        }
        //prepare data for create user
        const userData = await this.authFactoryService.register(registerDto);
        //send email
        await sendEmail({
            to: userData.email,
            subject: "Confirm your email",
            html: `
                <h2>Confirm Your Account</h2>
                <p>Hello,</p>
                <p>Thanks for signing up! Please use the code below to confirm your email:</p>
                <h3 style="color:blue;">${userData.otp}</h3>
                <p>If you didn’t request this, ignore this email.</p>
                `
        })
        const user = await this.userRepository.create(userData);

        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: user
        });
    }
    //confirm account 
    confirmAccount = async (req: Request, res: Response, next: NextFunction) => {
        //get data 
        const confirmAccountDto: ConfirmAccountDto = req.body;
        const user = await this.userRepository.exist({ email: confirmAccountDto.email });
        if (!user) {
            return next(new NotFoundException("User not found"));
        }
        //check otp is valid
        if (user.otp !== confirmAccountDto.otp) {
            return next(new BadRequestException("Invalid otp"));
        }
        //update user
        const updatedUser = await this.authFactoryService.confrimAccount(confirmAccountDto);
        await this.userRepository.update({ email: confirmAccountDto.email }, updatedUser);
        //send response
        return res.status(200).json({
            message: "User confirmed successfully",
            success: true,
        });
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        // get data 
        const loginDto: LoginDto = req.body;
        // check user is exist
        const user = await this.userRepository.exist({ email: loginDto.email, isVerified: true });

        if (!user) {
            return next(new NotFoundException("User not found"));
        }
        // check password
        const isPasswordMatch = await comparePassword(loginDto.password, user.password);
        if (!isPasswordMatch) {
            return next(new BadRequestException("Invalid password"));
        }
        // generate token
        // send response
        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            token: {
                accessToken: "will do",
                refreshToken: "will do"
            }
        });
    }

}

export default new AuthService();