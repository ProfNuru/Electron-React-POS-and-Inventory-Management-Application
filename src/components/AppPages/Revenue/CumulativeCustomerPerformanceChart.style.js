import styled from 'styled-components';

export const CumulativeCustomerPerformance = styled.div`
    background-color: var(--light);
    box-shadow:var(--default-shadow);
    padding:2% 20px 6% 20px;
    margin: 20px 0px;
    width:100%;
    height:100%;

    & .chartHead{
        display:grid;
        grid-template-columns: repeat(3,1fr);
    }
`