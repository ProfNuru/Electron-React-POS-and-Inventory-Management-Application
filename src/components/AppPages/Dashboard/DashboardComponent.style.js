import styled from 'styled-components';

export const DashboardStyle = styled.div`
    display:${(props)=>props.visible ? 'flex':'none'};
    flex-direction:column;
    padding:10px;

    & .dashboard-content{
        display:grid;
        grid-template-columns: 3fr 1fr;
        gap: 10px;
    }
    & .dashboard-main,
    & .dashboard-side{
        display:flex;
        flex-direction:column;
    }
    & .daily-summary{
        background-color: var(--light);
        display:flex;
        justify-content:space-between;
        align-items: center;
        box-shadow:var(--default-shadow);
        padding:10px 20px;
        margin-bottom: 10px;
    }
    & .daily-summary .current-datetime{
        text-align: right;
    }
    & .sum-cards{
        display:flex;
        justify-content:space-between;
    }
    & .sum-cards>div{
        background-color: var(--light);
        display:flex;
        justify-content:space-between;
        align-items: center;
        padding:10px;
        box-shadow:var(--default-shadow);
        border-radius:5px;
    }
    & .sum-cards div .sum-icon{
        margin-left: 10px;
        font-size: 4em;
    }
`