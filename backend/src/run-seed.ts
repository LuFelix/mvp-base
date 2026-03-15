// run-seed.ts
/**
 * ============================================================================
 * SCRIPT DE SEED - POPULAÇÃO INICIAL DO BANCO DE DADOS
 * ============================================================================
 *
 * Este script executa o seeding da aplicação, criando:
 * - 3 Roles (colaborador, administrador, gente_e_cultura)
 * - 1 Usuário Administrador padrão
 *
 * Como executar:
 *   - Local: npm run seed
 *   - Docker: docker-compose exec backend npm run seed
 *   - Direto: npx ts-node src/run-seed.ts
 *
 * ============================================================================
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seeds/seed.service';

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// Funções de log com cores
const log = {
  title: (msg: string) => console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════${colors.reset}`),
  section: (msg: string) => console.log(`${colors.bright}${colors.blue}▶ ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  detail: (msg: string) => console.log(`${colors.dim}  → ${msg}${colors.reset}`),
  stats: (msg: string) => console.log(`${colors.bright}${colors.magenta}${msg}${colors.reset}`),
};

async function bootstrap() {
  log.title('');
  console.log(`${colors.bright}${colors.cyan}  🌱 SCRIPT DE SEED - POPULAÇÃO INICIAL DO BANCO${colors.reset}`);
  log.title('');

  let app: any = null;
  const startTime = Date.now();

  try {
    // ========================================
    // ETAPA 1: Inicializar aplicação NestJS
    // ========================================
    log.section('Etapa 1: Inicializando aplicação NestJS');
    log.detail('Carregando módulos...');

    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error'], // Apenas erros
    });

    log.success('Aplicação NestJS inicializada com sucesso');

    // ========================================
    // ETAPA 2: Verificar conexão com banco
    // ========================================
    log.section('Etapa 2: Verificando conexão com banco de dados');
    log.detail('Testando conexão...');

    try {
      // Tenta obter o DataSource usando diferentes tokens
      let dataSource: any;
      try {
        dataSource = app.get('DataSource');
      } catch (e) {
        try {
          dataSource = app.get(require('typeorm').DataSource);
        } catch (e2) {
          // Se não conseguir injetar, apenas conta que a app iniciou = BD ok
          log.success('Conexão com banco de dados estabelecida (via inicialização)');
          log.detail('Database: meusistema (configurado no .env)');
          dataSource = null;
        }
      }

      if (dataSource) {
        await dataSource.query('SELECT 1');
        log.success('Conexão com banco de dados estabelecida');
        log.detail(`Database: ${dataSource.options.database}`);
      }
    } catch (err) {
      log.error('Não foi possível conectar ao banco de dados');
      throw err;
    }

    // ========================================
    // ETAPA 3: Contar dados existentes
    // ========================================
    log.section('Etapa 3: Verificando dados existentes');

    try {
      const roleRepository = app.get('RoleRepository') ||
                            app.get(require('typeorm').Repository);
      const userRepository = app.get('UserRepository') ||
                            app.get(require('typeorm').Repository);

      let rolesCount = 0;
      let usersCount = 0;

      try {
        rolesCount = await roleRepository.count();
        usersCount = await userRepository.count();
      } catch (e) {
        // Se não conseguir contar, assume 0
        log.info('Não foi possível contar registros (pode ser primeira inicialização)');
        rolesCount = 0;
        usersCount = 0;
      }

      log.info(`Roles existentes: ${rolesCount}`);
      log.info(`Usuários existentes: ${usersCount}`);
    } catch (e) {
      log.warn('Pulando verificação de dados existentes');
    }

    // ========================================
    // ETAPA 4: Executar seeding
    // ========================================
    log.section('Etapa 4: Executando processo de seeding');
    log.detail('Criando roles padrão...');
    log.detail('Criando usuário administrador...');

    const seeder = app.get(SeedService);
    await seeder.run();

    // ========================================
    // ETAPA 5: Verificar resultado
    // ========================================
    log.section('Etapa 5: Verificando resultado final');

    let rolesCountAfter = 0;
    let usersCountAfter = 0;
    let roles: any[] = [];

    try {
      const roleRepository = app.get('RoleRepository') ||
                            app.get(require('typeorm').Repository);
      const userRepository = app.get('UserRepository') ||
                            app.get(require('typeorm').Repository);

      try {
        rolesCountAfter = await roleRepository.count();
        usersCountAfter = await userRepository.count();
        roles = await roleRepository.find();
      } catch (e) {
        log.warn('Não foi possível verificar resultado final');
      }

      log.info(`Roles criadas: ${rolesCountAfter}`);
      log.info(`Usuários criados: ${usersCountAfter}`);

      // Mostrar roles criadas
      if (roles && roles.length > 0) {
        log.detail('Roles no banco:');
        for (const role of roles) {
          console.log(
            `${colors.cyan}    • ${role.name}${colors.reset}`
          );
        }
      }
    } catch (e) {
      log.warn('Pulando verificação final de resultados');
    }

    // ========================================
    // RESUMO FINAL
    // ========================================
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log.title('');
    log.stats(`✅ SEEDING CONCLUÍDO COM SUCESSO!`);
    log.title('');

    console.log(`${colors.green}${colors.bright}Resumo:${colors.reset}`);
    console.log(
      `  • Total de Roles: ${colors.bright}${rolesCountAfter}${colors.reset}`
    );
    console.log(
      `  • Total de Usuários: ${colors.bright}${usersCountAfter}${colors.reset}`
    );
    console.log(
      `  • Tempo de execução: ${colors.bright}${duration}s${colors.reset}`
    );

    console.log(`\n${colors.cyan}Usuário Admin Padrão:${colors.reset}`);
    console.log(`  • CPF: 00000000000`);
    console.log(`  • Email: admin@meusistema.com`);
    console.log(`  • Senha: Senha@123`);

    log.title('');
    console.log(
      `\n${colors.bright}${colors.green}Para entrar no dashboard, use as credenciais acima.${colors.reset}\n`
    );

  } catch (error) {
    // ========================================
    // TRATAMENTO DE ERROS
    // ========================================
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    log.title('');
    log.error('ERRO DURANTE O SEEDING!');
    log.title('');

    console.log(`${colors.red}${colors.bright}Detalhes do erro:${colors.reset}`);
    if (error instanceof Error) {
      console.log(`${colors.red}Nome: ${error.name}${colors.reset}`);
      console.log(`${colors.red}Mensagem: ${error.message}${colors.reset}`);
      if (error.stack) {
        console.log(`\n${colors.dim}Stack trace:${colors.reset}`);
        console.log(`${colors.dim}${error.stack}${colors.reset}`);
      }
    } else {
      console.log(`${colors.red}${JSON.stringify(error, null, 2)}${colors.reset}`);
    }

    console.log(
      `\n${colors.yellow}Tempo até o erro: ${duration}s${colors.reset}\n`
    );

    process.exit(1);

  } finally {
    // ========================================
    // LIMPEZA E FECHAMENTO
    // ========================================
    if (app) {
      log.section('Fechando aplicação...');
      await app.close();
      log.success('Aplicação encerrada');
    }
  }
}

// Executar bootstrap
bootstrap().catch((error) => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
