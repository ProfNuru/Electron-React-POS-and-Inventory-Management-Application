import styled from 'styled-components';

export const InventoryStyle = styled.div`
    display:${(props)=>props.visible ? 'grid':'none'};
    grid-template-columns: 2fr 1fr;
    gap:10px;
    padding:10px;

    &>div{
        display:flex;
        flex-direction:column;
    }
    & .out-of-stock-items,
    & .in-stock-items{
        margin: 20px 0px;
    }
    
    & .out-of-stock-items h3{
        color:darkred;
    }
    & .in-stock-items h3{
        color:#333;
    }
    & .inv-cards{
        display:flex;
        justify-content:space-between;
        margin-top:10px;
    }
    & .inv-cards>div{
        background-color: var(--light);
        display:flex;
        justify-content:space-between;
        align-items: center;
        padding:10px;
        box-shadow:var(--default-shadow);
        border-radius:5px;
    }
    & .inv-cards div .sum-icon{
        margin-left: 10px;
        font-size: 4em;
    }
    & .inv-action-btn{
        display:block;
        margin-top:10px;
    }
    & .inventory-side .purchases-section{
        margin-top: 20px;
    }
    & .inventory-side .purchases-section h4{
        text-align:center;
    }
`