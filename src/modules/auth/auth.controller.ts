import { Controller, Get, HttpCode } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("api/auth")
export class AuthController {

    constructor(private authSvc: AuthService) {}
    
    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation()
    public login(): string {
        return this.authSvc.login();
    }

}