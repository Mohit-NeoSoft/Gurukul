import { Component, OnInit } from '@angular/core';
import { NetworkService } from './services/network-service/network.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private networkService: NetworkService) {}

  ngOnInit() {
    this.networkService.checkNetworkStatus();
    this.networkService.watchNetworkChanges();
  }
}
