// Caminho: src/activities/activities.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Multer } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ActivitiesService } from './activities.service';
import { ActivityBodyDto, CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; // Ajuste o caminho se necessário

@ApiTags('activities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/activities', // Pasta específica para atividades
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '-');
          cb(null, uniqueSuffix + '-' + originalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB limit
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(
    @Body() createActivityDto: ActivityBodyDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const pdfPath = file ? file.path : undefined;
    return this.activitiesService.create(createActivityDto, pdfPath);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/activities',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const originalName = file.originalname.replace(/\s+/g, '-');
          cb(null, uniqueSuffix + '-' + originalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 100 * 1024 * 1024 },
    })
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update an activity' })
  @ApiBody({ type: UpdateActivityDto })
  @ApiResponse({ status: 200, description: 'Activity updated successfully' })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @UploadedFile() file?: Multer.File,
  ) {
    const pdfPath = file ? file.path : undefined;
    return this.activitiesService.update(id, updateActivityDto, pdfPath);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limit per page' })
  @ApiQuery({ name: 'type', required: false, type: String, description: 'Filter by type (simulador, conversor, comparador)' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({ status: 200, description: 'List of activities returned successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.activitiesService.findAll(Number(page), Number(limit), type, category, isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an activity by ID' })
  @ApiResponse({ status: 200, description: 'Activity details.', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found.' })
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete an activity by ID' })
  @ApiParam({ name: 'id', required: true, description: 'Activity ID' })
  @ApiResponse({ status: 200, description: 'Activity deactivated successfully', type: Activity })
  @ApiResponse({ status: 404, description: 'Activity not found' })
  remove(@Param('id') id: string) {
    return this.activitiesService.softRemove(id);
  }
}