import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AppStore } from '@his-viewmodel/app-store-editor';
import { UserAccount } from './user-account';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { JSONCodec, Msg } from '@his-base/jetstream-ws';
import { AppStoreService } from './app-store.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
            TableModule,
            CheckboxModule,
            FormsModule,
            ButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'user-auth';
  appStores$!: Observable<Msg>;
  userAccounts$!: Observable<Msg>;
  appStores: AppStore[] = [];
  userAccounts: UserAccount[] = [];
  editableUsers: UserAccount[] = [];
  changedUsers: UserAccount[] = [];

  #userService = inject(UserService);
  #appStoreService = inject(AppStoreService)

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.#userService.connect()

    this.appStores$ = this.#appStoreService.getAppStoreList();

    this.appStores$.subscribe((msg: Msg) => {
      const jsonCodec = JSONCodec();
      this.appStores = jsonCodec.decode(msg.data) as AppStore[];
    })

    this.userAccounts$ = this.#userService.getUserAccountList();

    this.userAccounts$.subscribe((msg: Msg) => {
      const jsonCodec = JSONCodec();
      this.userAccounts = jsonCodec.decode(msg.data) as UserAccount[];
      this.editableUsers = [...this.userAccounts]
    })
  }

  onClearClick() {
    this.editableUsers = [...this.userAccounts]
  }

  onUpdateClick() {
    this.changedUsers = this.userAccounts.filter((x,idx) => {
      return JSON.stringify(x.systemAuthority) !== JSON.stringify(this.editableUsers[idx].systemAuthority)
    })
    this.#userService.pubAppStore(this.changedUsers, 'userAccount.update')
  }

  async ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.#userService.disconnect()
  }
}
