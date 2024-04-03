import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';
import { HeaderPage } from '../header/header.page';
import { DateFormatPipe } from '../pipes/date-format.pipe';

@NgModule({
  declarations: [FooterPage,HeaderPage,DateFormatPipe],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FooterPage,HeaderPage,DateFormatPipe]
})
export class SharedModule { }
