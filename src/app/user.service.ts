import { Injectable, inject } from '@angular/core';
import { JetstreamWsService, TransferInfo } from '@his-base/jetstream-ws';
import { UserAccount } from './user-account';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  #jetStreamWsService = inject(JetstreamWsService);

  #url = 'ws://localhost:8080';

  async connect() {
    await this.#jetStreamWsService.connect(this.#url)
  }

  async disconnect() {
    // 連線關閉前，會先將目前訂閱給排空
    await this.#jetStreamWsService.drain();
  }

  getUserAccountList() {
    const info: TransferInfo<string> = {
      data: '',
    };
    // @ts-ignore
    // 需帶入指定的主題跟要傳遞的資料
    return this.#jetStreamWsService.request('userAccount.list',info.data);
  }

  async pubAppStore(payload: UserAccount[], subject: string) {
    const info: TransferInfo<UserAccount[]> = {
      data: payload,
    };

    // @ts-ignore
    // 需帶入指定發布主題以及要傳送的訊息
    await this.#jetStreamWsService.publish(subject, info.data);
  }
}
