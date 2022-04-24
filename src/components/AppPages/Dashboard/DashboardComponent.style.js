import styled from 'styled-components';

export const DashboardStyle = styled.div`
    display:${(props)=>props.visible ? 'flex':'none'};
    flex-direction:column;
    padding:10px;

    & .dashboard-content{
        display:grid;
        grid-template-columns: 2fr 1fr;
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
    & .revenueChange{
        display: inline-block;
        margin-left:10px;
    }
    & .changeIncrease{
        color:darkgreen;
        font-size: 0.5em;
    }
    & .changeDecrease{
        color:darkred;
        font-size: 0.5em;
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
    & .yearly-revenue-line-chart{
        background-color: var(--light);
        box-shadow:var(--default-shadow);
        padding:10px;
        margin: 10px 0px;
    }
    & .yearly-revenue-line-chart .dashboardRevenueChartHeading{
        display:grid;
        grid-template-columns: repeat(3,1fr);
        align-items: center;
    }
    & .yearly-revenue-line-chart .dashboardRevenueChartHeading h6{
        color:#aaa;
    }
    & .yearly-revenue-line-chart .dashboardRevenueChartHeading>div{
        text-align:center;
    }
    & .yearly-revenue-line-chart .dashboardRevenueChartHeading div .dailyMonthlyRadioBtns div{
        display:flex;
        justify-content:center;
        align-items: center;
    }
`