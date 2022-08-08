import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { Banner } from './model/banner.model';
import { ShopInfo } from './model/shop-info.model';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopInfo, Banner]), FilesModule],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule { }
