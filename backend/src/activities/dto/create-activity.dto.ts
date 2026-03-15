// Caminho: src/activities/dto/create-activity.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class ActivityBodyDto {
    @ApiProperty({ example: 'Simulador de Juros Compostos' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Simule o crescimento do seu patrimônio ao longo do tempo.' })
    @IsString()
    shortDescription: string;

    @ApiProperty({ example: 'Esta ferramenta interativa permite calcular o montante final com base em aportes mensais e taxas de juros, gerando gráficos de evolução.' })
    @IsString()
    description: string;

    @ApiProperty({ enum: ['simulador', 'conversor', 'comparador'], example: 'simulador' })
    @IsEnum(['simulador', 'conversor', 'comparador'], { message: 'O tipo deve ser "simulador", "conversor" ou "comparador"' })
    type: string;

    @ApiProperty({ example: 'Matemática Financeira' })
    @IsString()
    category: string;

    @ApiProperty({ enum: ['Iniciante', 'Intermediário', 'Avançado'], example: 'Iniciante' })
    @IsEnum(['Iniciante', 'Intermediário', 'Avançado'], { message: 'O nível deve ser "Iniciante", "Intermediário" ou "Avançado"' })
    difficultyLevel: string;

    @ApiProperty({ example: true })
    @IsBoolean()
    @Type(() => Boolean) // Garante a conversão caso venha como string "true" no FormData
    hasAI: boolean;
}

export class CreateActivityDto extends ActivityBodyDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Arquivo PDF opcional contendo o embasamento teórico da atividade.',
        required: false,
    })
    @IsOptional()
    file?: any;
}