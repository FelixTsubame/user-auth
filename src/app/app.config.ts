import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { JetstreamWsService } from '@his-base/jetstream-ws';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimations(),
    {
      provide: JetstreamWsService,
      useValue: new JetstreamWsService({ name: 'OPD'})
    }]
};
