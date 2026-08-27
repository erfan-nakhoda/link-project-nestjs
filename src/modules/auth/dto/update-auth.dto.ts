import { PartialType } from '@nestjs/swagger';
import { signUpAuthDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(signUpAuthDto) {}
