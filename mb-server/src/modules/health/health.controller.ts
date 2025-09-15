import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/api';

@ApiTags('Health check')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: "Test health check" })
    getHealthCheck(): BaseResponse<string> {
        return {
            status: 'success',
            message: 'Server đang chạy thành công !',
            data: String(process.env.APP_NAME)
        }
    }
}
