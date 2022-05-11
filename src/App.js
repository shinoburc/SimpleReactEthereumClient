import './App.css';

import React, {  useState } from "react";
import { ethers } from "ethers";

function App() {
  const [provider, setProvider] = useState(null);
  const [counter, setCounter] = useState(null);
  const [account, setAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState(null);

  // counterAddress と counterAbi は環境によって書き換える必要があります。
  // Counater.json を読み込んで利用するとよりスマート。
  const counterAddress = "0x5E5A16AaFb816F04E09a05d1C03d98D7b1ee56C2";
  const counterAbi = [
        {
        "constant": true,
        "inputs": [],
        "name": "count",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": true,
        "inputs": [],
        "name": "get",
        "outputs": [
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "inc",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "constant": false,
        "inputs": [],
        "name": "dec",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
        }
    ];

    //メタマスクの接続
    const connectMetaMask= () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((accounts) => {
                    setAccount(accounts[0]);
                    let provider = new ethers.providers.Web3Provider(window.ethereum);
                    setProvider(provider);
                    let signer = provider.getSigner(0);
                    setCounter(new ethers.Contract(counterAddress, counterAbi, signer));
                })
                .catch((error) => {
                    console.log("MetaMask error" + error)
                });
        } else {
            console.log("Need to install MetaMask");
        }
    };

  // Counter.get でカウントの値を取得する関数
  const  getCount =  async () => {
    let count = await counter.get();
    setCount(count.toNumber());
  };

  // Counter.inc を呼び出す関数
  const  incCount =  async () => {
    let transaction = await counter.inc();
    // トランザクションが処理されるのを待つ
    await transaction.wait();
    setTransactionHash(transaction.hash);
    getCount();
  };

  // Counterdec を呼び出す関数
  const  decCount =  async () => {
    let transaction = await counter.dec();
    // トランザクションが処理されるのを待つ
    await transaction.wait();
    setTransactionHash(transaction.hash);
    getCount();
  };

  // transactionHash からトランザクション情報を取得する関数
  const getTransactionInfo =  async () => {
    let transactionInfo = await provider.getTransaction(transactionHash);
    setTransactionInfo(JSON.stringify(transactionInfo, null, 2));
  };

  return (
    <div className="App">
      <header className="App-header">
      <div>
        Account: { account }
        <div>
            Count: { count }
        </div>
        <div>
            TransactionHash: { transactionHash }
        </div>
        <input type="button" value="connect" onClick={ connectMetaMask }/>
        <input type="button" value="get" onClick={ getCount }/>
        <input type="button" value="inc" onClick={ incCount }/>
        <input type="button" value="dec" onClick={ decCount }/>
        <input type="button" value="getTransactionInfo" onClick={ getTransactionInfo } />
      </div>
      <div>
        <pre>
          { transactionInfo }
        </pre>
      </div>
      </header>
    </div>
  );
}

export default App;