// Caminho: src/activities/activities.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';
import { join } from 'path';

import { Activity } from './entities/activity.entity';
import { ActivityBodyDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) { }

  async create(activityBody: ActivityBodyDto, pdfPath?: string): Promise<Activity> {
    const { name, shortDescription, description, type, category, difficultyLevel, hasAI } = activityBody;

    const newActivity = this.activityRepository.create({
      name,
      shortDescription,
      description,
      type,
      category,
      difficultyLevel,
      hasAI,
      pdfPath,
      isActive: true, // Por padrão, uma atividade recém-criada fica ativa
    });

    await this.activityRepository.save(newActivity);
    return newActivity;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type?: string,
    category?: string,
    isActive?: boolean,
  ) {
    const skip = (page - 1) * limit;

    const queryBuilder = this.activityRepository
      .createQueryBuilder('activity')
      .skip(skip)
      .take(limit)
      .orderBy('activity.createdAt', 'DESC');

    // Aplicando os filtros opcionais
    if (type) {
      queryBuilder.andWhere('activity.type = :type', { type });
    }
    
    if (category) {
      queryBuilder.andWhere('activity.category = :category', { category });
    }

    if (isActive !== undefined && isActive !== null) {
        // Assegura que o parâmetro passado seja tratado como boolean na query do banco
        queryBuilder.andWhere('activity.isActive = :isActive', { isActive: String(isActive) === 'true' });
    }

    const [activities, total] = await queryBuilder.getManyAndCount();

    return {
      data: activities,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOneBy({ id });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    pdfPath?: string,
  ): Promise<Activity> {
    const activity = await this.findOne(id);

    // Se vier um novo PDF, apaga o antigo do disco
    if (pdfPath && activity.pdfPath) {
      try {
        const oldFilePath = join(process.cwd(), activity.pdfPath);
        await fs.unlink(oldFilePath);
      } catch (error) {
        console.warn(`Falha em deletar arquivo antigo ${activity.pdfPath}:`, error);
      }
    }

    // O Object.assign mescla os campos recebidos no DTO com o objeto do banco
    Object.assign(activity, updateActivityDto);

    if (pdfPath) {
      activity.pdfPath = pdfPath;
    }

    return await this.activityRepository.save(activity);
  }

  async softRemove(id: string): Promise<Activity> {
    const activity = await this.findOne(id);
    activity.isActive = false; // Exclusão lógica (soft delete)
    return await this.activityRepository.save(activity);
  }
}