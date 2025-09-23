import { Request, Response, NextFunction } from "express";
import { ConfirmAccountDto, LoginDto, RegisterDto } from "./auth.dto";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { BadRequestException, ConflictException, NotFoundException, comparePassword, sendEmail } from "../../utils";
import { authProvider } from "./provider/auth.provider";

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
        console.log(userData);
        const user = await this.userRepository.create(userData);//save include send email
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
        await authProvider.CheckOtp(confirmAccountDto, user);
        //check user is verified
        if (user!.isVerified) {
            return next(new BadRequestException("User already verified"));
        }
        //update user
        const updatedUser = await this.authFactoryService.confrimAccount(confirmAccountDto);
        console.log(updatedUser);
        await this.userRepository.update({ email: confirmAccountDto.email }, { $set: updatedUser });
        //send response
        return res.sendStatus(204);
    }
    //Login
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
    //forgot password
    forgetPassword = (req: Request, res: Response, next: NextFunction) => {
        //get data
        //check user is exist
        //resend otp
        //check otp from provider
        //update user password and credentialUpdataAt for expreied refresh token
        //send response

    }

    //resend otp
    resendOtp = (req: Request, res: Response, next: NextFunction) => {
        //get data
        //check otp from provider
        //resend otp as email by save how??
        //send response
    }

}

export default new AuthService();