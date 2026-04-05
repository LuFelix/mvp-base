import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  ParseUUIDPipe, // <-- Importado o ParseUUIDPipe
  Query 
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/role.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('create')
  @ApiOperation({ summary: 'Cria uma nova role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: 201, description: 'Role criada com sucesso', type: Role })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 409, description: 'Role já existe' })
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as roles' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Roles listadas com sucesso', type: [Role] })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Role[]; total: number; page: number; limit: number; totalPages: number }> {
    page = Math.max(1, Number(page));
    limit = Math.min(100, Math.max(1, Number(limit)));
    
    return this.rolesService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lista uma role específica pelo ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: String }) // <-- Tipo String no Swagger
  @ApiResponse({ status: 200, description: 'Role Encontrada', type: Role })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Role> { // <-- ParseUUIDPipe e string
    return this.rolesService.findOne(id); // <-- string pro service
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma role pelo ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: String }) // <-- Tipo String no Swagger
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role atualizada com sucesso', type: Role })
  @ApiResponse({ status: 400, description: 'Requisição inválida' })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  @ApiResponse({ status: 409, description: 'Nome da role já existe' })
  async update(
    @Param('id', ParseUUIDPipe) id: string, // <-- ParseUUIDPipe e string
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<Role> {
    return this.rolesService.update(id, updateRoleDto); // <-- string pro service
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma role pelo ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: String }) // <-- Tipo String no Swagger
  @ApiResponse({ status: 200, description: 'Role excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  @ApiResponse({ status: 409, description: 'Não é possível excluir a role: há usuários associados a esta role' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> { // <-- ParseUUIDPipe e string
    return this.rolesService.remove(id); // <-- string pro service
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Lista uma role específica pelo nome' })
  @ApiParam({ name: 'name', description: 'Nome da role' })
  @ApiResponse({ status: 200, description: 'Role encontrada', type: Role })
  @ApiResponse({ status: 404, description: 'Role não encontrada' })
  async findOneByName(@Param('name') name: string): Promise<Role> {
    return this.rolesService.findOneByName(name);
  }
}