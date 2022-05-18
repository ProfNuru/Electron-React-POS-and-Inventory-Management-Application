import styled from 'styled-components';


export const SettingsPage = styled.div`
    width: 70%;
    min-height: 400px;
    margin: 40px auto;
    display:${(props)=>props.visible ? 'grid':'none'};
    gap: 20px;
    grid-template-columns: 1fr 3fr;

    .settingsNavs,
    .settingsContent{
        background-color:aliceblue;
        border-radius: 5px;
    }
`
