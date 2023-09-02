import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { cleaningAllTables, seedsTransfer } from '@testUtil/initial_data/seed'
@Controller({
  path: '/debug',
})
export class DebugController {
  constructor() {}

  @Get()
  @ApiResponse({ status: 201 })
  async postDebug(@Query('operation') operation: string) {
    switch (operation) {
      case 'init':
        await cleaningAllTables()
        await seedsTransfer()
        return 'success'
      default:
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
}
