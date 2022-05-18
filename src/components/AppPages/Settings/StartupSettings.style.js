import styled from 'styled-components';

export const StartupSettingsPage = styled.div`
    margin: 20px;

    h1{
        margin-bottom: 3%;
    }
    .settingRows{
        display:flex;
        align-items: center;
        padding: 3% 5% 3% 0;
        border-bottom: 1px solid #ccc;
    }
    .settingRows .checkbox{
        margin-left:50%;
    }
    .buttons{
        display:flex;
        justify-content:flex-end;
        margin-top: 5%;
    }
`