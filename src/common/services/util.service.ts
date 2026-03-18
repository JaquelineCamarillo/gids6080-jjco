//util.service.ts
import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import type { StringValue } from "ms";



@Injectable()
export class UtilService{

    constructor(private readonly jwtSvc: JwtService) {} 

    public async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    public async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
    public async generateJWT (
        payload: object,
        expiresIn: StringValue | number = "60s"):
        Promise < string > {
        return await this.jwtSvc.signAsync(
            payload,
            {
                secret:process.env.JWT_SECRET,
                expiresIn,
            })
    }

    public async getPayload (jwt: string):Promise<any>{
        return await this.jwtSvc.verifyAsync(
            jwt,
            {
                secret:process.env.JWT_SECRET,
            })
    }
}