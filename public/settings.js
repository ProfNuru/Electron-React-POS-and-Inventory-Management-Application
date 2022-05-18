const electron = require('electron');
const path = require('path');
const fs = require('fs');

class SettingsStorage{
    constructor(user_settings="pos_user_settings.db"){
        const URI = (electron.app || electron.remote.app).getPath('userData');
        this.DATABASE = path.join(URI, user_settings);
    }
}
module.exports = SettingsStorage;
