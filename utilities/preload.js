const electron = require('electron');
const { ipcRenderer } = require("electron");
const currency = require('currency.js');
const printJS = require("print-js");


const API = {
    updatePurchasedItem:(signal,value)=>{return ipcRenderer.send(signal,value)},
    sendAsynchronousIPC:(signal)=>{return ipcRenderer.sendSync(signal)},
    insertNewData:(signal,item)=>{return ipcRenderer.sendSync(signal,item)},
    updateDelete:(signal,id)=>{return ipcRenderer.sendSync(signal,id)},

    currency:(val)=>{return currency(val, {symbol:'',separator:','}).format()},
    currencyValue:(val)=>{return currency(val).value},
    getCurrency:(val,symb)=>{return currency(val, { symbol: symb+" ", separator: ',' }).format()},
    addCurrencies:(val1,val2)=>{return currency(val1).add(val2).value},
    subtractCurrencies:(val1,val2)=>{return currency(val1).subtract(val2).value},
    multiplyCurrencies:(val1,val2)=>{return currency(val1).multiply(val2).value},

    printInvoice:(div,styles,cb)=>{
        printJS({
            printable:div,
            type:'html',
            onPrintDialogClose: cb,
            style:styles
        })
    }

}


electron.contextBridge.exposeInMainWorld("api", API);
