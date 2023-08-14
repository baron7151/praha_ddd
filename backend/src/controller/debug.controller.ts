import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { cleaningAllTables, seedsTransfer } from '@testUtil/initial_data/seed'
@Controller({
  path: '/debug',
})
export class DebugController {
  constructor() {}

  @Post()
  @ApiResponse({ status: 201 })
  async postDebug(@Body('operation') operation: string) {
    switch (operation) {
      case 'init':
        await cleaningAllTables()
        await seedsTransfer()
        return 'suucess'
      default:
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
}
