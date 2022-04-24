import styled from 'styled-components';

export const IncomeStatementChartComponent = styled.div`
    background-color: var(--light);
    box-shadow:var(--default-shadow);
    padding:2% 20px 5% 20px;
    margin-bottom: 10px;
    width:100%;
    height:100%;

    & .chartHead{
        display:grid;
        grid-template-columns: repeat(3,1fr);
        align-items:center;
    }
    & .togglePlotsBtns{
        text-align:center;
    }
`