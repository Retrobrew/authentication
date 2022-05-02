import { Controller, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "src/modules/authentication/jwt-auth-guard";

@UsePipes(new ValidationPipe({
    transform: true
}))
@UseGuards(JwtAuthGuard)
@Controller('groups/')
export class CreateGroupController {
    
}