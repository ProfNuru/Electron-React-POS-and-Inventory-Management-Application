const electron = require('electron');
const {app, BrowserWindow} = electron;
const ipc = electron.ipcMain;
const path = require('path');
const Database = require("../utilities/database.js");

// Database tables
const ITEMS = 'items';
const SUPPLIERS = 'suppliers';
const CUSTOMERS = 'customers';
const PURCHASES = 'purchases';
const PAYMENT_STATUSES = 'payment_statuses';

const db = new Database();

function createWindow(){
    const win = new BrowserWindow({
        show:false,
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload: path.join(__dirname, "../utilities/preload.js"),
        }
    });
    win.maximize();
    win.show();

    win.loadURL('http://localhost:3000');
}

app.on('ready', createWindow);

app.on('window-all-closed', function(){
    if(process.platform !== 'darwin'){
        db.close();
        app.quit();
    }
});

app.on('activate', function(){
    if(BrowserWindow.getAllWindows().length === 0) createWindow()
});

// IPC Main Process handlers
    // Fetch data
ipc.on('get-all-items', async (event)=>{
    db.get_data(ITEMS)
        .then((items)=>{
            event.returnValue = items;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('get-all-suppliers', async (event)=>{
    db.get_data(SUPPLIERS)
        .then((suppliers)=>{
            event.returnValue = suppliers;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('get-all-purchases', async (event)=>{
    db.get_data(PURCHASES)
        .then((suppliers)=>{
            event.returnValue = suppliers;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('get-all-payment-statuses', async (event)=>{
    db.get_data(PAYMENT_STATUSES)
        .then((payment_status)=>{
            event.returnValue = payment_status;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('get-all-customers', async (event)=>{
    db.get_data(CUSTOMERS)
        .then((customers)=>{
            event.returnValue = customers;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

    // Insert data
ipc.on('new-item', async (event, new_item)=>{
    db.add_item(new_item)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('new-supplier', async (event, new_supplier)=>{
    db.add_supplier(new_supplier)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('new-customer', async (event, new_customer)=>{
    db.add_customer(new_customer)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('new-purchase', async (event, formData)=>{
    let new_purchase = {
        qty:formData.qty,
        supplierID:formData.supplier,
        cost:formData.unit_cost,
        itemID:formData.item.item_id,
        date_purchased:formData.date_purchased
    }
    db.add_purchase(new_purchase)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('new-invoice', async (event, invData)=>{
    db.add_invoice(invData)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('new-sales', async (event, salesData)=>{
    db.add_sales(salesData)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('post-purchase', (event,values)=>{
    db.update_item_qty(values.itemID,values.qty,values.new_cost)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            event.returnValue = err;
        })
})

    // Delete data
ipc.on('delete-supplier', async (event, id)=>{
    db.delete_supplier(id)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('delete-customer', async (event, id)=>{
    db.delete_customer(id)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('delete-item', async (event, id)=>{
    db.delete_item(id)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

    // Update data
ipc.on('edit-supplier', async (event, supplier)=>{
    db.edit_supplier(supplier)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('edit-customer', async (event, customer)=>{
    db.edit_customer(customer)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('edit-item', async (event, item)=>{
    db.edit_item(item)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})
