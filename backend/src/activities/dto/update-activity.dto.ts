// Caminho: src/activities/dto/update-activity.dto.ts

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
    // Não precisamos reescrever name, description, etc. 
    // O PartialType já herdou todos eles como opcionais!

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    isActive?: boolean;
}