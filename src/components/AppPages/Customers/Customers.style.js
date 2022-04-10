import styled from 'styled-components';


export const CustomersPage = styled.div`
    display:${(props)=>props.visible ? 'grid':'none'};
    gap: 10px;

    & .table-action-header{
        text-align:right;
    }
    & .table-action-btns{
        display:flex;
        justify-content:end;
    }
    & .table-action-btns button{
        margin:0px 2px;
    }
    & .pageNotifications{
        position:absolute;
        bottom:0px;
    }
`