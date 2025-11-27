import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlsService } from './urls.service';
import type { Response } from 'express';

@Controller()
export class RedirectController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlsService.findOne(shortCode);
    await this.urlsService.incrementAccess(shortCode);

    return res.redirect(url.url);
  }
}
