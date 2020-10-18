import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ElementDTO } from './models/ElementModel';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getElement(@Query('id') id: number = null): Promise<any> {
    return this.appService.getById(id);
  }

  @Get('/json')
  async getJson(): Promise<any> {
    return await this.appService.getJson();
  }

  @Post('')
  async createElement(@Body() elementDTO: ElementDTO): Promise<any> {
    if (!(await this.appService.getById(elementDTO.parent_id)))
      throw new BadRequestException();

    return await this.appService.createElement(elementDTO);
  }

  @Delete('')
  async deleteElements(@Query('id') id: number = null): Promise<any> {
    if (!(await this.appService.getById(id))) throw new BadRequestException();

    return await this.appService.deleteElements(id);
  }

  @Put('')
  async updateElements(@Body() elementDTO: ElementDTO): Promise<any> {
    if (!(await this.appService.getById(elementDTO.id)))
      throw new BadRequestException();

    return await this.appService.updateElement(elementDTO);
  }
}
