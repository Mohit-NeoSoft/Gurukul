import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';
import { HeaderPage } from '../header/header.page';
import { DateFormatPipe } from '../pipes/date-format.pipe';
import { RecentItemsPage } from '../recent-items/recent-items.page';

@NgModule({
  declarations: [FooterPage,HeaderPage,DateFormatPipe,RecentItemsPage],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FooterPage,HeaderPage,DateFormatPipe,RecentItemsPage]
})
export class SharedModule { }
