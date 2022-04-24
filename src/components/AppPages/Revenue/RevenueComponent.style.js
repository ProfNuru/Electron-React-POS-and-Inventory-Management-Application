import styled from 'styled-components';

export const RevenueContainer = styled.div`
    display:${(props)=>props.visible ? 'flex':'none'};
    flex-direction:column;
    padding:10px;

    & .income-statement-chart{
        height: 60vh;
    }
    & .customer-performance-chart{
        height: 70vh;
    }
    & .cumulative-customer-performance{
        height: 60vh;
    }
    & .customer-dataset{
        max-height:300px;
        overflow:auto;
    }
`
