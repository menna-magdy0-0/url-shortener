import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}
  async create(createUrlDto: CreateUrlDto) {
  const shortCode = nanoid(6);

    return await this.prisma.shortUrl.create({
      data: {
        shortCode,
        url: createUrlDto.url,
      },
    });
  }

  findAll() {
    return this.prisma.shortUrl.findMany();
  }

  async findOne(shortCode: string) {
    const record = await this.prisma.shortUrl.findUnique({ where: { shortCode } });

    if (!record) throw new NotFoundException('Short URL not found');

    return record;
  }

  async update(shortCode: string, updateUrlDto: UpdateUrlDto) {
    try {
      return await this.prisma.shortUrl.update({
        where: { shortCode },
        data: {
          url: updateUrlDto.url,
        },
      });
    } catch {
      throw new NotFoundException('Short URL not found');
    }
  }

  async remove(shortCode: string) {
    try {
      await this.prisma.shortUrl.delete({ where: { shortCode } });
      return;
    } catch {
      throw new NotFoundException('Short URL not found');
    }
  }
  async incrementAccess(shortCode: string) {
    return this.prisma.shortUrl.update({
      where: { shortCode },
      data: {
        accessCount: {
          increment: 1,
        },
      },
    });
  }
  async getStats(shortCode: string) {
    const url = await this.findOne(shortCode);
    return url;
  }
}
