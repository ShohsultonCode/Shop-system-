import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        if (!req.headers) {
            throw new HttpException(
                'No Authorization header',
                HttpStatus.BAD_REQUEST,
            );
        }
        if (!req.headers.authorization) {
            throw new HttpException(
                'No Authorization header',
                HttpStatus.BAD_REQUEST,
            );
        }

        const token = req.headers.authorization?.split(' ')[1];


        if (token) {
            try {
                const decoded = this.jwtService.verify(token);

                req.user = decoded;

                return true;
            } catch (err) {
                // Handle token validation error
                throw new HttpException('No Auth', HttpStatus.UNAUTHORIZED);
            }
        }

        // No token found or invalid token
        return false;
    }
}