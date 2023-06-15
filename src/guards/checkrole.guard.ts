import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        if (token) {
            try {
                const decoded = this.jwtService.verify(token);
                const userRole = decoded.role;

                if (userRole === 'admin') {
                    request.user = decoded;
                    return true;
                }
            } catch (err) {
                // Handle token validation error
            }
        }

        return false;
    }
}
