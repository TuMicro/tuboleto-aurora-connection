First of all (this will install yarn)

```
nvm install 16.13.2
nvm use 16.13.2
npm i -g corepack
corepack enable
```

# Overview: Connect to a wallet using Wallet Connect v1

This is an example repo to show how to connect a React app to an app using Wallet Connect version 1.

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

yarn add firebase
firebase init hosting

Deploy:

yarn build && firebase deploy --only hosting && time /t
