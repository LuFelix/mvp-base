// admin/dto/updateuserole.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRoleDto {
  @IsNotEmpty()
  @IsString()
  roleName: string;
}