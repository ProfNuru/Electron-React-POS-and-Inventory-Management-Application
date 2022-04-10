import styled from 'styled-components';

export const CustomersList = styled.div`
    background-color:#fff;

    & .actions-row{
        display:flex;
        justify-content:space-between;
        align-items:center;
        padding:10px;
    }
    & .actions-row>div{
        display:flex;
        justify-content:space-around;
        align-items:center;
    }
    & .actions-row>div svg{
        font-size: 1.6em;
        margin-right:10px;
    }
`