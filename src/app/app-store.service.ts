import { Injectable, inject } from '@angular/core';
import { JetstreamWsService, TransferInfo } from '@his-base/jetstream-ws';

@Injectable({
  providedIn: 'root'
})
export class AppStoreService {

  #jetStreamWsService = inject(JetstreamWsService);

  getAppStoreList() {
    const info: TransferInfo<string> = {
      data: '',
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('appStore.list',info.data);
  }
}
