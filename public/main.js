const electron = require('electron');
const {app, BrowserWindow} = electron;
const ipc = electron.ipcMain;
const path = require('path');
const isDev = require('electron-is-dev');
const sqlite3 = require('sqlite3').verbose();
const EventEmitter = require('events');

// const Settings = require("./settings.js");
// Database tables
const ITEMS = 'items';
const SUPPLIERS = 'suppliers';
const CUSTOMERS = 'customers';
const PURCHASES = 'purchases';
const PAYMENT_STATUSES = 'payment_statuses';
const INVOICES = 'invoices';
const SALES = 'sales';
let authWin;

class Database{
    constructor(db_uri="chanjipos_database.db") {
        const URI = (electron.app || electron.remote.app).getPath('userData');
        this.DATABASE = path.join(URI, db_uri);
    
        // Connect to database
        this.DB_CONN = new sqlite3.Database(this.DATABASE, (err)=>{
            if(err){
                console.error(err.message);
            }
            console.log('Connected to the POS database.', this.DATABASE);
        });
    
        // Set up tables if they don't exist
        this.DB_CONN.serialize(()=>{
          // Items table: item_id, item, description, available_qty, cost_unit_price, 
          // selling_unit_price, cost_bulk_price, selling_bulk_price, bulk_qty, date_added
          let item_qry = "CREATE TABLE IF NOT EXISTS items (item_id INTEGER PRIMARY KEY,"+
                        "item TEXT NOT NULL UNIQUE,"+
                        "description TEXT,"+
                        "available_qty INTEGER NULL,"+
                        "cost_unit_price NUMERIC NULL,"+
                        "selling_unit_price NUMERIC NULL,"+
                        "cost_bulk_price NUMERIC,"+
                        "selling_bulk_price NUMERIC,"+
                        "bulk_qty INTEGER,"+
                        "date_added INTEGER NOT NULL"+
                      ")";
          this.DB_CONN.run(item_qry);

        //Suppliers table: supplier_name,email,phone,country,city,address,date_added
        let supplier_qry = "CREATE TABLE IF NOT EXISTS suppliers (supplier_id INTEGER PRIMARY KEY,"+
                            "supplier_name TEXT NOT NULL UNIQUE,"+
                            "email TEXT,"+
                            "phone TEXT NOT NULL,"+
                            "country TEXT NOT NULL,"+
                            "city TEXT NOT NULL,"+
                            "address TEXT NOT NULL,"+
                            "date_added INTEGER NOT NULL"+
                            ")";
        this.DB_CONN.run(supplier_qry);
        
        //Cusstomers table: customer_name,email,phone,country,city,address,date_added
        let customer_qry = "CREATE TABLE IF NOT EXISTS customers (customer_id INTEGER PRIMARY KEY,"+
                            "customer_name TEXT NOT NULL UNIQUE,"+
                            "email TEXT,"+
                            "phone TEXT NOT NULL,"+
                            "country TEXT NOT NULL,"+
                            "city TEXT NOT NULL,"+
                            "address TEXT NOT NULL,"+
                            "date_added INTEGER NOT NULL"+
                            ")";
        this.DB_CONN.run(customer_qry);

        let purch_qry = "CREATE TABLE IF NOT EXISTS purchases (purchase_id INTEGER PRIMARY KEY,"+
                    "supplier_id INTEGER NULL,"+
                    "item_id INTEGER NOT NULL,"+
                    "qty INTEGER NOT NULL,"+
                    "unit_price NUMERIC NOT NULL,"+
                    "date_purchased INTEGER NOT NULL,"+
                    "FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id) ON DELETE CASCADE ON UPDATE NO ACTION,"+
                    "FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION"+
                  ")";
        this.DB_CONN.run(purch_qry);

        let payment_status_qry = "CREATE TABLE IF NOT EXISTS payment_statuses (payment_status_id INTEGER PRIMARY KEY,"+
                    "payment_status TEXT NOT NULL UNIQUE)";
        this.DB_CONN.run(payment_status_qry);

        let inv_qry = "CREATE TABLE IF NOT EXISTS invoices (invoice_id INTEGER PRIMARY KEY,"+
                    "invoice_uid TEXT NOT NULL,"+
                    "customer_id INTEGER NULL,"+
                    "number_of_items INTEGER NOT NULL,"+
                    "sub_total NUMERIC NOT NULL,"+
                    "grand_total NUMERIC NOT NULL,"+
                    "discount NUMERIC NOT NULL,"+
                    "shipping NUMERIC NOT NULL,"+
                    "tax_percent NUMERIC NOT NULL,"+
                    "tax_value NUMERIC NOT NULL,"+
                    "delivery_status TEXT NOT NULL,"+
                    "payment_status INTEGER NOT NULL,"+
                    "payment_amount NUMERIC NOT NULL,"+
                    "date INTEGER NOT NULL,"+
                    "FOREIGN KEY (customer_id) REFERENCES customers (customer_id) ON DELETE CASCADE ON UPDATE NO ACTION"+
                  ")";
        this.DB_CONN.run(inv_qry);

        //sale_id,invoice_id,item_id,qty,unit_price,cost_price
        let sale_qry = "CREATE TABLE IF NOT EXISTS sales (sale_id INTEGER PRIMARY KEY,"+
                        "invoice_id INTEGER NOT NULL,"+
                        "item_id INTEGER NOT NULL,"+
                        "qty INTEGER NOT NULL,"+
                        "cost_price NUMERIC NOT NULL,"+
                        "unit_price NUMERIC NOT NULL,"+
                        "FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id) ON DELETE CASCADE ON UPDATE NO ACTION,"+
                        "FOREIGN KEY (item_id) REFERENCES items (item_id) ON DELETE CASCADE ON UPDATE NO ACTION"+
                        ")";
        
        this.DB_CONN.run(sale_qry);
        
        });  
    }
    
    // Close database connection
    close(){
        this.DB_CONN.close((err)=>{
            if(err){
                return console.error(err);
            }
        })
    }

    // Get items
    get_data(table){
        return new Promise((resolve,reject)=>{
            // console.log("Getting",table);
            let sql = `SELECT * FROM ${table}`;
            let all_items = [];
            
            try{
                this.DB_CONN.all(sql, function(err, rows) {
                    if(err){
                        console.error(err);
                        reject({table:table,msg:'query failed'});
                    }else{
                        rows.forEach(function (row) {
                            let obj = {}
                            for(var i = 0; i<Object.keys(row).length; i++){
                            obj[Object.keys(row)[i]] = row[Object.keys(row)[i]]
                            }
                            all_items.push(obj);
                        });
                        let data = {table:table,data:all_items};
                        // console.log(data, "from database");
                        resolve(data);
                    }
                });
            }catch (err){
                console.log("Error getting items", err);
                reject({table:table,msg:'query failed'});
            }
        });
    }

    add_item(new_item){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO items (item,description,date_added) VALUES (?,?,?)`;
            this.DB_CONN.run(sql, [new_item.item,new_item.description,new_item.date_added], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Item added successfully'});                
            });

        });
    }

    // Delete items
    delete_supplier(id){
        return new Promise((resolve,reject)=>{
            let sql = `DELETE FROM suppliers WHERE supplier_id =?`;
            this.DB_CONN.run(sql, id, function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Supplier deleted!'});                
            });

        });
    }

    delete_customer(id){
        return new Promise((resolve,reject)=>{
            let sql = `DELETE FROM customers WHERE customer_id =?`;
            this.DB_CONN.run(sql, id, function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Customer deleted!'});                
            });

        });
    }

    delete_item(id){
        return new Promise((resolve,reject)=>{
            let sql = `DELETE FROM items WHERE item_id =?`;
            this.DB_CONN.run(sql, id, function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Item deleted!'});                
            });

        });
    }

    // Insert items
    add_supplier(new_supplier){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO suppliers (supplier_name,email,phone,country,city,address,date_added) VALUES (?,?,?,?,?,?,?)`;
            this.DB_CONN.run(sql, [new_supplier.supplier_name,new_supplier.email,new_supplier.phone,new_supplier.country,new_supplier.city,new_supplier.address,new_supplier.date_added], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Supplier added'});                
            });

        });
    }

    add_customer(new_customer){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO customers (customer_name,email,phone,country,city,address,date_added) VALUES (?,?,?,?,?,?,?)`;
            this.DB_CONN.run(sql, [new_customer.customer_name,new_customer.email,new_customer.phone,new_customer.country,new_customer.city,new_customer.address,new_customer.date_added], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Customer added'});                
            });

        });
    }
    
    add_purchase(new_purchase){
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO purchases (supplier_id,item_id,qty,unit_price,date_purchased) VALUES (?,?,?,?,?)`;
            this.DB_CONN.run(sql, [new_purchase.supplierID,new_purchase.itemID,new_purchase.qty,new_purchase.cost,new_purchase.date_purchased], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Purchase completed'});                
            });

        });
    }

    //customer_id,number_of_items,sub_total,grand_total,discount,shipping,tax_percent,
    //tax_value,delivery_status,payment_status,payment_amount,date
    add_invoice(new_inv){
        console.log(new_inv);
        return new Promise((resolve,reject)=>{
            let sql = `INSERT INTO invoices (invoice_uid,customer_id,number_of_items,sub_total,grand_total,discount,shipping,tax_percent,tax_value,delivery_status,payment_status,payment_amount,date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            this.DB_CONN.run(sql, [new_inv.invoiceUID,new_inv.customerID,new_inv.numberOfItems,new_inv.subTotal,
                new_inv.grandTotal,new_inv.discount,new_inv.shipping,new_inv.taxPercent,
                new_inv.taxValue,new_inv.deliveryStatus,new_inv.paymentStatus,new_inv.paymentAmount,
                new_inv.date], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Invoice Saved',ID:this.lastID,saved_invoice:new_inv});                
            });

        });
    }

    add_sales(salesData){
        return new Promise((resolve,reject)=>{
            this.DB_CONN.serialize(()=>{
                let invID = salesData.invoiceID;
                for(let i=0; i<salesData.items.length; i++){
                    let sql = `INSERT INTO sales (invoice_id,item_id,qty,unit_price,cost_price) VALUES (?,?,?,?,?)`;
                    this.DB_CONN.run(sql, [invID,salesData.items[i].item_id,
                        salesData.items[i].qty,salesData.items[i].selling_unit_price,
                        salesData.items[i].cost_unit_price], function(err){
                        if(err){
                            console.log(err);
                            reject({success:false,msg:err.code});
                        }
                    })
                }
            });
            resolve({success:true,msg:'All sales saved',sales_data:salesData});
        });
    }

    // update items
    edit_supplier(supplier){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE suppliers SET supplier_name=?, email=?, phone=?, country=?, city=?, address=? WHERE supplier_id=?`;
            this.DB_CONN.run(sql, [supplier.supplier_name,supplier.email,supplier.phone,supplier.country,supplier.city,supplier.address,supplier.supplier_id], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Supplier updated'});                
            });

        });
    }

    edit_customer(customer){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE customers SET customer_name=?, email=?, phone=?, country=?, city=?, address=? WHERE customer_id=?`;
            this.DB_CONN.run(sql, [customer.customer_name,customer.email,customer.phone,customer.country,customer.city,customer.address,customer.customer_id], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Customer updated'});                
            });

        });
    }

    edit_item(item){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE items SET item=?, description=?, cost_unit_price=?, selling_unit_price=?, available_qty=? WHERE item_id=?`;
            this.DB_CONN.run(sql, [item.item,item.description,item.cost_unit_price,item.selling_unit_price,item.available_qty,item.item_id], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Item updated'});                
            });

        });
    }

    add_invoice_payment(payment){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE invoices SET payment_amount=? WHERE invoice_id=?`;
            this.DB_CONN.run(sql, [payment.amount,payment.invoice], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Payment Completed'});                
            });

        });
    }
    
    update_item_qty(item_id,add_qty,cost){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE items SET available_qty = ?, cost_unit_price=? WHERE item_id=?`;
            this.DB_CONN.run(sql, [add_qty,cost,item_id ], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Item updated'});                
            });

        });
    }
    
    update_items_qty(sales_data){
        return new Promise((resolve,reject)=>{
            var sql = '';
            for(let i=0;i<sales_data.length;i++){
                if(i === sales_data.length - 1){
                    sql += `UPDATE items SET available_qty = ${sales_data[i].available_qty >= sales_data[i].qty ? sales_data[i].available_qty - sales_data[i].qty : sales_data[i].available_qty} WHERE item_id=${sales_data[i].item_id}`;
                }else{
                    sql += `UPDATE items SET available_qty = ${sales_data[i].available_qty >= sales_data[i].qty ? sales_data[i].available_qty - sales_data[i].qty : sales_data[i].available_qty} WHERE item_id=${sales_data[i].item_id};`;
                }
            }
            this.DB_CONN.run(sql, function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Items updated'});          
            });
        });
    }

    subtract_item_qty(item){
        return new Promise((resolve,reject)=>{
            let sql = `UPDATE items SET available_qty = ? WHERE item_id=?`;
            this.DB_CONN.run(sql, [item.available_qty > item.qty ? item.available_qty - item.qty : item.available_qty,item.item_id ], function(err){
                if(err){
                    console.log(err);
                    reject({success:false,msg:err.code});
                }
                resolve({success:true,msg:'Item updated'});                
            });
        });
    }
}

const loadingEvents = new EventEmitter();
const db = new Database();

// Remove default menu bar from all windows
// electron.app.on('browser-window-created',function(e,window) {
//     window.setMenu(null);
// });

function createWindow(){
    const win = new BrowserWindow({
        show:false,
        icon: isDev
        ? path.join(__dirname, "chanji_logo192.png")
        : `file://${path.join(__dirname,'../build/chanji_logo192.png')}`,
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload: path.join(__dirname, "preload.js"),
        }
    });
    win.maximize();
    win.show();

    win.loadURL(
        isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname,'../build/index.html')}`
        );
}

function authenticationWindow(){
    authWin = new BrowserWindow({
        width: 1000,
        height: 690,
        icon: isDev
        ? path.join(__dirname, "chanji_logo192.png")
        : `file://${path.join(__dirname,'../build/chanji_logo192.png')}`,
        webPreferences:{
            // devTools: false,
            nodeIntegration:false,
            contextIsolation:true,
            preload: path.join(__dirname, "preload.js"),
        }
    });

    authWin.loadURL(
        isDev
        ? path.join(__dirname, "authenticationWindow.html")
        : `file://${path.join(__dirname,'../build/authenticationWindow.html')}`
        );
}

function loadApp(){
    const splash = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        transparent:true,
        icon: isDev
        ? path.join(__dirname, "chanji_logo192.png")
        : `file://${path.join(__dirname,'../build/chanji_logo192.png')}`,
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            preload: path.join(__dirname, "preload.js"),
        }
    });
    splash.loadURL(
        isDev
        ? path.join(__dirname, "splash.html")
        : `file://${path.join(__dirname,'../build/splash.html')}`
    );
    setTimeout(()=>loadingEvents.emit('finished'),5000)

    loadingEvents.on('finished',()=>{
        splash.close();
        authenticationWindow();
    });
}

app.on('ready', loadApp);

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

ipc.on('get-all-invoices', async (event)=>{
    db.get_data(INVOICES)
        .then((invoices)=>{
            invoices.data.reverse();
            event.returnValue = invoices;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

ipc.on('get-all-sales', async (event)=>{
    db.get_data(SALES)
        .then((sales)=>{
            sales.data.reverse();
            event.returnValue = sales;
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
        .then(async (fb)=>{
            var items = fb.sales_data.items;
            await sequential(items);
            event.returnValue = fb;
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

ipc.on('pay-debt', async (event, item)=>{
    db.add_invoice_payment(item)
        .then((feedback)=>{
            event.returnValue = feedback;
        })
        .catch((err)=>{
            console.log(err);
            event.returnValue = err;
        });
})

async function sequential(arr){
    if(arr.length <= 0){
         return {success:true,msg:'Items updated'}
    }
    let fb = await db.subtract_item_qty(arr.pop());
    if(fb.success){
        sequential(arr);
    }else{
        console.log('An error occurred');
        return
    }
}
