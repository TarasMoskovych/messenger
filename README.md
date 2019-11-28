# Messenger

Messenger is a web/desktop chat application using [Angular](https://angular.io) + [Firebase](https://firebase.google.com)

See demo [https://messenger-ng.firebaseapp.com](https://messenger-ng.firebaseapp.com)

Desktop installers can be found [here](https://drive.google.com/drive/folders/1PlfF3_yuENOTFR_v4QPqkDnmEc4HlRid)

## Features
1. Registration with confirm email functionality
2. Authentication (by `email` + `password`, and by `google` sign in)
3. My account (edit name and profile photo)
4. Add friends (with live-search)
5. Accept/Decline friends requests
6. Groups (create, remove, manage members of a group)
7. Chatting with friend and in a group (emoji, send images + drag-and-drop)
8. [Electron](https://electronjs.org) integration for a desktop application (windows and linux installers)
9. Video calls using [Agora SDK](https://www.agora.io/en)

## Installation

Paste into `src/app/configs/firebase.config.ts` your firebase credentials.

Paste into `electron/auth.config.js` your desktop project credentials.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

Run `npm run package:debian` to create debian installer.

Run `npm run package:windows` to create windows installer.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
