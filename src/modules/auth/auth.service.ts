import { Request, Response } from "express";
import { ConfirmAccountDto, ForgetPasswordDto, LoginDto, RegisterDto, ResendOtpDto } from "./auth.dto";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, comparePassword } from "../../utils";
import { authProvider } from "./provider/auth.provider";

class AuthService {

    // private dbService = new AbstractRepository<IUser>(User);
    private readonly userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor() { }

    register = async (req: Request, res: Response) => {
        //TODO::: send email for confirmation and otp 
        //get data
        const registerDto: RegisterDto = req.body;

        //check user is exist
        const userExist = await this.userRepository.exist({ email: registerDto.email });

        if (userExist) {
            throw new ConflictException("User already exist");
        }
        //prepare data for create user
        const userData = await this.authFactoryService.registerFactory(registerDto);
        console.log(userData);
        const user = await this.userRepository.create(userData);//save include send email
        return res.status(201).json({
            message: "User created successfully",
            success: true,
            data: user
        });
    }
    //confirm account 
    confirmAccount = async (req: Request, res: Response) => {
        //get data 
        const confirmAccountDto: ConfirmAccountDto = req.body;
        const user = await this.userRepository.exist({ email: confirmAccountDto.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        await authProvider.CheckOtpProvider(confirmAccountDto, user);
        //check user is verified
        if (user!.isVerified) {
            throw new BadRequestException("User already verified");
        }
        //update user
        const updatedUser = await this.authFactoryService.confrimAccountFactory(confirmAccountDto);
        console.log(updatedUser);
        await this.userRepository.update({ email: confirmAccountDto.email }, { $set: updatedUser });
        //send response
        return res.sendStatus(204);
    }
    //resend otp
    resendOtp = async (req: Request, res: Response) => {
        //get data
        const resendOtpDto: ResendOtpDto = req.body;

        const user = await this.userRepository.exist({ email: resendOtpDto.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        //check otp from provider
        console.log(user);

        await authProvider.resendOtpProvider(
            resendOtpDto,
            user
        );

        //resend otp as email by save how??
        const updatedUser = await this.authFactoryService.resendOtpFactory(resendOtpDto);
        console.log(updatedUser);
        await this.userRepository.update({ email: resendOtpDto.email }, { $set: updatedUser });
        //send response
        return res.sendStatus(204);
    }
    //forgot password
    forgetPassword = async (req: Request, res: Response) => {

        //get data
        //check password
        const forgetPasswordDto: ForgetPasswordDto = req.body;
        if (forgetPasswordDto.password !== forgetPasswordDto.confirmPassword) {
            throw new BadRequestException("Password not match");
        }
        //check user is exist
        const user = await this.userRepository.exist({ email: forgetPasswordDto.email });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        //check otp from provider
        await authProvider.CheckOtpProvider({ email: forgetPasswordDto.email, otp: user.otp! }, user);
        //update user password and credentialUpdataAt for expreied refresh token
        const updatedUser = await this.authFactoryService.forgetPasswordFactory(forgetPasswordDto);
        console.log(updatedUser);
        await this.userRepository.update({ email: forgetPasswordDto.email }, { $set: updatedUser });
        //send response
        return res.sendStatus(204);
    }
    //Login
    login = async (req: Request, res: Response) => {
        // get data 
        const loginDto: LoginDto = req.body;
        // check user is exist
        const user = await this.userRepository.exist({ email: loginDto.email, isVerified: true });
        if (!user) {
            throw new ForbiddenException("User not found");
        }
        // check password
        const isPasswordMatch = await comparePassword(loginDto.password, user.password);
        if (!isPasswordMatch) {
            throw new ForbiddenException("Invalid password");
        }
        // TODO:: generate token
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