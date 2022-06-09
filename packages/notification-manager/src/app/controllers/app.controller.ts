import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { Logger } from '@logging/logger/logger';

@ApiBearerAuth('authorization')
@Controller('/v1')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private logger: Logger,
  ) { }

  @ApiTags('health')
  @Get('/health')
  @HealthCheck()
  public check() {
    this.logger.log('checking health check :: test log message');
    return 'OK'
  }

}
