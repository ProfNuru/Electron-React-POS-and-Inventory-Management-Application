import styled from 'styled-components';


export const CustomersValueComponent = styled.div`
    margin:20px 0px 10px 0px;
    padding:10px 20px;
    display:flex;
    flex-direction:column;
    background-color: var(--light);
    box-shadow:var(--default-shadow);
    height: 400px;
    overflow:auto;

    & .customersValueHeading{
        display:flex;
        justify-content:space-between;
    }
    & .customersValueHeading .total-sale{
        color: darkblue;
    }
    & .customersValueHeading .total-paid{
        color: darkgreen;
    }
    & .customersValueHeading .total-due{
        color: darkred;
    }
`