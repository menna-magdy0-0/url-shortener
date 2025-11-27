import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post()
  async create(@Body() createUrlDto: CreateUrlDto) {
    const result = await this.urlsService.create(createUrlDto);
    return result;
  }
  //for testing purposes
  @Get()
  findAll() {
    return this.urlsService.findAll();
  }

  @Get(':shortCode')
  async find(@Param('shortCode') shortCode: string) {
    return this.urlsService.findOne(shortCode);
  }

  @Patch(':shortCode')
  async update(
    @Param('shortCode') shortCode: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlsService.update(shortCode, updateUrlDto);
  }

  @Delete(':shortCode')
  async delete(@Param('shortCode') shortCode: string) {
    await this.urlsService.remove(shortCode);
    return { message: 'Deleted successfully' };
  }

  @Get(':shortCode/stats')
  async stats(@Param('shortCode') shortCode: string) {
    return this.urlsService.getStats(shortCode);
  }

  @Get('r/:shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlsService.findOne(shortCode);
    await this.urlsService.incrementAccess(shortCode);

    return res.redirect(url.url);
  }
}
