import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  Inject,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetUserDataResponse } from './response/get-user-data-response'
import { GetUserDataUseCase } from 'src/app/user/get-user-data-usecase'
import { PostUserDataRequest } from './request/post-user-data-request'
import { PatchUserDataRequest } from './request/patch-user-data-request'
import { PostUserDataUseCase } from 'src/app/user/post-user-data-usecase'
import { PatchUserDataUseCase } from 'src/app/user/patch-user-data-usecase'
@Controller({
  path: '/user',
})
export class UserController {
  constructor(
    @Inject(GetUserDataUseCase) private readonly getUsecase: GetUserDataUseCase,
    @Inject(PostUserDataUseCase)
    private readonly postUsecase: PostUserDataUseCase,
    @Inject(PatchUserDataUseCase)
    private readonly patchUsecase: PatchUserDataUseCase,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: GetUserDataResponse })
  async findUserByName(@Query('user_name') user_name: string) {
    const result = await this.getUsecase.do(user_name)
    const response = new GetUserDataResponse({ userDatas: result })
    return response
  }
  @Get()
  @ApiResponse({ status: 200, type: GetUserDataResponse })
  async findUsers() {
    const result = await this.getUsecase.do()
    const response = new GetUserDataResponse({ userDatas: result })
    return response
  }

  @Post()
  @ApiResponse({ status: 201 })
  async postUserData(@Body() postUserDataDto: PostUserDataRequest) {
    await this.postUsecase.do(postUserDataDto.user_name, postUserDataDto.email)
  }

  @Patch()
  @ApiResponse({ status: 200 })
  async patchUserData(@Body() patchUserDataDto: PatchUserDataRequest) {
    await this.patchUsecase.do({
      userId: patchUserDataDto.user_id,
      userName: patchUserDataDto.user_name,
      email: patchUserDataDto.email,
      status: patchUserDataDto.status,
    })
  }

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
