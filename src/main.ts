import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

const mimeTypes = [
  'video/mp4', "video/3gpp", "video/quicktime"
  , "video/x-ms-wmv", "video/x-msvideo", "video/mpeg"
  , "video/dvd", "video/xvid", "video/x-flv"
  , "video/x-f4v", "video/divx"
];

const video = document.createElement("video");

mimeTypes.forEach(type => console.log(type,  video.canPlayType(type)));
