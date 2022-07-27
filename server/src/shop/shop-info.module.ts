import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { Banner } from './model/banner.model';
import { ShopInfo } from './model/shop-info.model';
import { ShopInfoController } from './shop-info.controller';
import { ShopInfoService } from './shop-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShopInfo, Banner]), FilesModule],
  controllers: [ShopInfoController],
  providers: [ShopInfoService]
})
export class ShopModule { }
