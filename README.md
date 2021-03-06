First of all (this will install yarn)

```
nvm install 16.13.2
nvm use 16.13.2
npm i -g corepack
corepack enable
```

# Overview: Connect to a wallet using Wallet Connect v1

This repository contains the source code for the connector and top-up website for the TuBoleto app using your Aurora wallet through Wallet Connect v1.

The relevant code is in `./src/App.js`.

The additional packages required are:

- [Wallet connect web3 provider](https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider)
- [Web3](https://www.npmjs.com/package/web3)


## Run it

Install dependencies with

```shell
yarn
```

Run the demo application with

```shell
yarn start
```

## Additional Info

You can [read more about using Wallet Connect v1 here](https://docs.walletconnect.com/1.0/).

This example was started with [Create React App](https://reactjs.org/docs/create-a-new-react-app.html). Unnecessary files were deleted.


## Other useful commands:


In case you dont have firebase installed:

```
npm install -g firebase-tools
firebase login
```

Deploy:

```
yarn build && firebase deploy --only hosting && time /t
```

## Other commands

yarn add firebase
firebase init hosting