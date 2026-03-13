import { Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("api/auth")
export class AuthController {

    constructor(private authSvc: AuthService) {}
    //decators
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "Login to the application" })
    public login(): string {
        return this.authSvc.login();
    }

}