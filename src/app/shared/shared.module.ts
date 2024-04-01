import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FooterPage } from '../footer/footer.page';
import { HeaderPage } from '../header/header.page';

@NgModule({
  declarations: [FooterPage,HeaderPage],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [FooterPage,HeaderPage]
})
export class SharedModule { }
