import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetUserDataResponse } from './response/get-user-data-response'
import { PostUserDataRequest } from './request/post-user-data-request'
import { GetSomeDataUseCase } from '../app/sample/get-some-data-usecase'
import { PostSomeDataUseCase } from '../app/sample/post-some-data-usecase'
import { SomeDataRepository } from 'src/infra/db/repository/sample/some-data-repository'
import { PrismaClient } from '@prisma/client'
import { SomeDataQS } from 'src/infra/db/query-service/sample/some-data-qs'
import { UserDataQS } from 'src/infra/db/query-service/user-data-qs'
import { GetUserDataUseCase } from 'src/app/get-user-data-usecase'
@Controller({
  path: '/user',
})
export class UserController {
  @Get()
  async findUserByName(@Query('name') name: string) {
    const prisma = new PrismaClient()
    const qs = new UserDataQS(prisma)
    const usecase = new GetUserDataUseCase(qs)
    const result = await usecase.do(name)
    const response = new GetUserDataResponse({ userDatas: result })
    return response
  }

  async findUsers() {
    const prisma = new PrismaClient()
    const qs = new UserDataQS(prisma)
    const usecase = new GetUserDataUseCase(qs)
    const result = await usecase.do()
    const response = new GetUserDataResponse({ userDatas: result })
    return response
  }

  // @Post()
  // async postUserData(
  //   @Body() postUserDataDto: PostUserDataRequest,
  // ): Promise<void> {
  //   const prisma = new PrismaClient()
  //   const repo = new UserDataRepository(prisma)
  //   const usecase = new PostSomeDataUseCase(repo)
  //   await usecase.do({
  //     required: postSomeDataDto.required,
  //     number: postSomeDataDto.number,
  //   })
  // }

  // @Patch()
  // async updateUser(@Body() xxx: xxx) {}
}

/*
export class UserController {
  // memo: @ApiResponseを定義しておかないとSwaggerに出力されない
  @Get()
  findAll(Query) {
    return `This action returns all cats (limit: ${query.limit} items)`
  }

  @Get(':username')
  findOne(@Param('username') id: string) {
    return `This action returns a #${id} cat`
  }
  @Get()
  @ApiResponse({ status: 200, type: GetSomeDataResponse })
  async getSomeData(): Promise<GetSomeDataResponse> {
    const prisma = new PrismaClient()
    const qs = new SomeDataQS(prisma)
    const usecase = new GetSomeDataUseCase(qs)
    const result = await usecase.do()
    const response = new GetSomeDataResponse({ someDatas: result })
    return response
  }

  @Post()
  async postSomeData(
    @Body() postSomeDataDto: PostSomeDataRequest,
  ): Promise<void> {
    const prisma = new PrismaClient()
    const repo = new SomeDataRepository(prisma)
    const usecase = new PostSomeDataUseCase(repo)
    await usecase.do({
      required: postSomeDataDto.required,
      number: postSomeDataDto.number,
    })
  }
}
*/
// @Get()
// async findAllUser(): Promise<GetUserDataResponse> {
//   // user検索を行う。
//   const prisma = new PrismaClient()
//   const qs = new UserDataQS(prisma)

//   return ''
// }
