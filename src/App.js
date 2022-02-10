import './App.css';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import React from 'react';
import { newKitFromWeb3 } from '@celo/contractkit';
import { providers, BigNumber } from "ethers";

const { ethers } = require("ethers");
const sleep = function (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class App extends React.Component {

  componentDidMount() {
    this.connect();
  }

  constructor(props) {
    super(props)
    this.state = {
      provider: null,
      kit: null,
      someAddress: "0xca0bc7119a461d58fb4d498921248892677060fa", // J
      // someAddress: "0xc528f91cf9035878d92d7c043377eab2af9dc6a7", // K
      trLoading: false,
    }

    this.connect = this.connect.bind(this)
    this.sendcUSD = this.sendcUSD.bind(this)
    this.disconnect = this.disconnect.bind(this)
  }

  connect = async () => {
    try {
      if (this.state.provider == null) {
        const provider = new WalletConnectProvider({
          rpc: {
            // 44787: "https://alfajores-forno.celo-testnet.org",
            // 42220: "https://forno.celo.org", // from: https://docs.celo.org/getting-started/wallets/using-metamask-with-celo/manual-setup
            1313161554: "https://mainnet.aurora.dev",
          },
        });

        await provider.enable()
        const web3 = new Web3(provider);
        let kit = newKitFromWeb3(web3)

        kit.defaultAccount = provider.accounts[0]

        provider.on("accountsChanged", (accounts) => {
          console.log(accounts);
        });

        this.setState({ provider, kit }); // equivale a this.setState({provider : provider, kit : kit});
      }

      const amountStr = this.getAmountFromQueryParams();

      // TODO: maybe trigger sendcUSD automatically
      this.sendcUSD(amountStr);

    } catch (e) {
      console.error(e);
    }

  }

  sendcUSD = async (amountStr) => {
    if (this.state.trLoading) {
      console.log("There is already a transaction in progress");
      return;
    }

    this.setState({
      trLoading: true,
    });

    await sleep(2); // millis

    try {
      let kit = this.state.kit;

      // 2 recomendaciones:
      //let x = 5; // Evitar manejar números con js (así sean enteros o flotantes)
      // Todo mantenerlo en números enteros (wei) lo más que se pueda, cuando queramos mostrar algo en UI usar funciones como 
      // formatEther.
      // Para lograr esto:
      // Usar clases de manejo de números enteros grandes: BigNumber (disponible luego de instalar la librería ethers: 'yarn add ethers')
      // Ejm: 
      //BigNumber.from(10).pow(18).mul(2).add(BigNumber.from(10).pow(18))
      // Ejm: BigNumber.from(1_000_000)

      //let amount = kit.web3.utils.toWei(amountStr, 'ether');
      let amount = ethers.utils.parseEther(amountStr);
      
      /*const stabletoken = await kit.contracts.getStableToken();
  
      const tx = await stabletoken.transfer(this.state.someAddress, amount).send(
        {feeCurrency: stabletoken.address}
      );
      const receipt = await tx.waitReceipt();*/

      // REEMPLAZAR las 3 líneas anteriores por:

      // Alternativamente leer la guía de walletConnect v1 para una forma que no usa ethers: 
      // https://docs.walletconnect.com/quick-start/dapps/node#send-transaction-eth_sendtransaction

      // El siguiente código es una forma que usa la librería ethers:
      // Revisar esto primero: https://docs.walletconnect.com/quick-start/dapps/web3-provider
      const web3Provider = new providers.Web3Provider(this.state.provider);

      // Si es necesario, revisar: https://docs.ethers.io/v5/getting-started/
      // Si es necesario, tmb revisar https://github.com/ethers-io/ethers.js/issues/775#issuecomment-608085004 para ver como obtener el signer

      const signer = web3Provider.getSigner(); // este provider debe ser un objeto de la librería ethers

      console.log("amount",amount);
      console.log("to",this.state.someAddress);
      const tx = signer.sendTransaction({
        to: this.state.someAddress, // a quien se le envia el token nativo
        value: amount, // cantidad en wei
      });
      // // obtener el receipt así:
      const receipt = await (await tx).wait();

      console.log(receipt);
      //alert(JSON.stringify(receipt));

      this.openTuBoleto(amountStr);      
      
    } catch (e) {
      if (e.message.indexOf("execution reverted: transfer value exceeded balance of sender") !== -1) {
        // not enough balance
        alert("Lo siento, no tienes suficientes Aurora Dólares 😢");
      } else {
        console.log(e);
        console.error(e);
      }
    }

    this.setState({
      trLoading: false,
    });

  }

  openTuBoleto = (amountStr) => {
    document.location = "tuboleto://topup?amount=" + amountStr; // https://google.com/? Aquí https es el esquema
  }

  disconnect = async () => {
    await this.state.provider.disconnect();
    this.setState({ provider: null, kit: null });
  }

  getAmountFromQueryParams = () => {
    let params = (new URL(document.location)).searchParams;
    let amount = params.get("amount") ?? "0.001";
    // let ts = params.get("ts") ?? "0.001";
    return amount;
  }

  render() {

    let conectionDependantContent, account;

    const amountStr = this.getAmountFromQueryParams();
    const amn = parseFloat(amountStr);
    const aproxPEN = amn * 4;

    if (this.state.kit !== null) {
      account = this.state.kit.defaultAccount
    }


    if (this.state.provider !== null) {
      conectionDependantContent = (
        <>
          <div>
            <button onClick={() => this.sendcUSD(amountStr)}>Reintentar el envío de {amountStr} cUSD (aprox. {aproxPEN.toFixed(2)} soles)</button>
          </div>
          <p>
            <span style={{
              fontSize: '14px',
            }}>🟢 Billetera conectada</span>
            <br />
            <span style={{
              fontSize: '12px',
            }}>{account}</span>
          </p>


          <button onClick={() => this.disconnect()}>Desconectar</button>
        </>
      )
    } else {
      conectionDependantContent = (<div>
        <button onClick={() => this.connect()}>Conectar Billetera</button>
      </div>)
    }


    return (
      <div className="App">
        <header className="App-header">
          <img src={"https://static.wixstatic.com/media/b75418_3675dc741fce4c85a6264579958ee039~mv2.png/v1/fill/w_298,h_108,al_c,q_85,usm_0.66_1.00_0.01/logo-tu-boleto-pago-sin-contacto-peru_pn.webp"}
            style={{
              width: 149,
              height: 54,
            }}
            className="App-logo" alt="logo" />
          <br />
          <br />
          {
            (
              this.state.trLoading ?
                "Cargando... ✌️" :
                <>
                  {conectionDependantContent}
                  <br />
                  {/* <button onClick={() => this.openTuBoleto(amountStr)}>Abrir TuBoleto</button>
                    <br/> */}
                </>
            )
          }


          <p style={{
            fontSize: '8px',
          }}>TuBoleto - Aurora connector v0.0.1</p>
        </header>
      </div>
    )
  }
}

export default App;
