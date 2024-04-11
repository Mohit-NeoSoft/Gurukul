import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';
import { HeaderPage } from '../header/header.page';
import { RecentItemsPage } from '../recent-items/recent-items.page';
import { ReplaceAmpPipe } from '../pipes/replace-amp/replace-amp.pipe';

@NgModule({
  declarations: [FooterPage,HeaderPage,RecentItemsPage,ReplaceAmpPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FooterPage,HeaderPage,RecentItemsPage,ReplaceAmpPipe]
})
export class SharedModule { }
