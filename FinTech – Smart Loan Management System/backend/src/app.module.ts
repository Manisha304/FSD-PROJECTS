import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { DocumentsModule } from './documents/documents.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [AuthModule, UsersModule, ApplicationsModule, DocumentsModule, NotificationsModule, ServicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
