import React, {useState} from 'react';
import { StartupSettingsPage } from './StartupSettings.style';
import Button from 'react-bootstrap/Button';

const StartupSettings = () => {
    const [loginOnStartup,setLoginOnStartup] = useState(false);
    const checkLoginOnStartup = (e)=>{
        setLoginOnStartup(e.currentTarget.checked);
    }

  return (
    <StartupSettingsPage>
        <h1>Startup Settings</h1>
        <div className="settingRows">
            <h6>Login on startup</h6>
            <div className="checkbox">
                <input type="checkbox" checked={loginOnStartup} onChange={checkLoginOnStartup} />
            </div>
        </div>
        <div className="buttons">
            <Button variant='primary'>Save</Button>
        </div>
    </StartupSettingsPage>
  )
}

export default StartupSettings