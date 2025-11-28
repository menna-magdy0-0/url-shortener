import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class UrlsService {
  constructor(
    private prisma: PrismaService ,
     @Inject(CACHE_MANAGER) private cacheManager:Cache
    ) {}
  async create(createUrlDto: CreateUrlDto) {
  const shortCode = nanoid(10);

    const createdUrl = await this.prisma.shortUrl.create({
      data: {
        shortCode,
        url: createUrlDto.url,
      },
      
    });
    await this.cacheManager.set(`url-${shortCode}`, createdUrl);
    console.log('Cache hit after create:', await this.cacheManager.get(`url-${shortCode}`));
    return createdUrl;
  }

  findAll() {
    return this.prisma.shortUrl.findMany();
  }

  async findOne(shortCode: string) {
    // Try to get url data from cache first
    const cachedUrl = await this.cacheManager.get(`url-${shortCode}`);
    if (cachedUrl) {
      console.log('Cache hit:', cachedUrl);
      return cachedUrl;
    }
    console.log('Cache miss for shortCode:', shortCode);
    // If not found in cache, get from database
    const url = await this.prisma.shortUrl.findUnique({ where: { shortCode } });
    
    //if not found in db
    if (!url) throw new NotFoundException('Short URL not found');
    // Store in cache for next time
    await this.cacheManager.set(`url-${shortCode}`, url);

    return url;
  }

  async update(shortCode: string, updateUrlDto: UpdateUrlDto) {
    try {
      const updatedUrl = await this.prisma.shortUrl.update({
        where: { shortCode },
        data: {
          url: updateUrlDto.url,
        },
      });
      await this.cacheManager.set(`url-${shortCode}`, updatedUrl);
      console.log('Cache updated after update:', await this.cacheManager.get(`url-${shortCode}`));
      return updatedUrl;
    } catch {
      throw new NotFoundException('Short URL not found');
    }
  }

  async remove(shortCode: string) {
    try {
      await this.prisma.shortUrl.delete({ where: { shortCode } });
      await this.cacheManager.del(`url-${shortCode}`);
      console.log('Cache miss');
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
