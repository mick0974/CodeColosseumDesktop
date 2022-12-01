# CodeColosseumDesktop

This app in intended to be used as Graphic client for Code Colosseum     
https://github.com/dariost/CodeColosseum

## Functionalities



## Install

TODO: Download a binary release

## Setup Development Environment 
The project by default is intended to be used with Visual Studio Code.
The app is a client and in order to be used it requires to connect to instance of CodeColosseum server (cocod).

Dependencies:
- NodeJS
- Yarn
- TypeScript
- Angular
- CodeColosseum 

- NodeJS
```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
  source ~/.bashrc
  nvm list-remote
  nvm install --lts
```

- Yarn
```bash
  npm install -g yarn
```

  
- TypeScript
```bash
  yarn install -g typescript
```

Angular
```bash
  yarn install -g @angular/cli
```

CodeColosseum ( for the server ) 
```bash
  sudo apt install cargo
  source install_coco.sh
  ./cocod
```


## Running the app

From the main folder of the app ( same location as package.json )     

** USE `yarn` INSTEAD OF `npm` OR YOU WOULD GET `errors` **

Install node dependencies (run once):     
```bash
yarn install
```

To run the app in Electron, during development 
Then navigate to `http://localhost:4200/`
```bash
npm run hotreload
```

To run the app during development in a standard browser environment ( it autoreloads when files are changed )     
Then navigate to `http://localhost:4200/`
```bash
ng serve
```

To create new components (ex: views ) 
```bash
ng generate component component-name
```

To build a "production" version, the build artifacts will be stored in the `dist/` directory.
```bash
ng build
```

To build a "production" version, the build artifacts will be stored in the `dist/` directory.
```bash
npm run electron-build-linux
```

__This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.5.__
