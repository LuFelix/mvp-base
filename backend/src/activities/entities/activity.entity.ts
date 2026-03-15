// Caminho: src/activities/entities/activity.entity.ts

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('activities') // Nome explícito para a tabela no banco de dados
export class Activity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 255, nullable: false })
    name: string;

    @Column({ length: 255, nullable: false })
    shortDescription: string;

    @Column({ type: 'text', nullable: false }) // Mudado para 'text' para permitir descrições maiores do funcionamento matemático
    description: string;

    @Column({ length: 50, nullable: false })
    type: string; // 'simulador', 'conversor', 'comparador'

    @Column({ length: 100, nullable: false })
    category: string; // Ex: 'Matemática Financeira', 'Estatística'

    @Column({ length: 50, nullable: false, default: 'Iniciante' })
    difficultyLevel: string; // Ex: 'Iniciante', 'Intermediário', 'Avançado'

    @Column({ nullable: false, default: false })
    hasAI: boolean; // Flag para saber se a ferramenta consulta a IA (como na Arena de Investimentos)

    @Column({ nullable: false, default: true }) // Atividades geralmente já nascem ativas, mas pode mudar para false se preferir
    isActive: boolean;

    @Column({ nullable: true })
    pdfPath: string; // Caso no futuro você queira anexar um PDF de fundamentação teórica à atividade

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}