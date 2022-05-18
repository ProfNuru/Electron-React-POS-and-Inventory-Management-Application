import React, {useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import { SettingsPage } from './Settings.style';
import UserSettings from './UserSettings';
import StartupSettings from './StartupSettings';

const Settings = ({visibility}) => {
    const [userTab,setUserTab] = useState(true);
    const [startupTab,setStartupTab] = useState(false);

    const toggleUserTab = ()=>{
        setUserTab(true);
        setStartupTab(false);
    }
    const toggleStartupTab = ()=>{
        setStartupTab(true);
        setUserTab(false);
    }

  return (
    <SettingsPage visible={visibility}>
        <div className="settingsNavs">
            <Nav className="flex-column">
                <Nav.Link style={{color:userTab ? '#000' : '#333',
                                backgroundColor:userTab ? '#fff' : 'aliceblue',
                                borderBottom:'1px solid #ccc'}}
                                onClick={toggleUserTab}>User Settings</Nav.Link>
                <Nav.Link style={{color:startupTab ? '#000' : '#333',
                                backgroundColor:startupTab ? '#fff' : 'aliceblue',
                                borderBottom:'1px solid #ccc'}}
                                onClick={toggleStartupTab}>Startup Settings</Nav.Link>
            </Nav>
        </div>
        <div className="settingsContent">
            {userTab && <UserSettings />}
            {startupTab && <StartupSettings />}
        </div>
    </SettingsPage>
  )
}

export default Settings