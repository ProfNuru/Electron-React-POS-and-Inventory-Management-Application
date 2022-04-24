import styled from 'styled-components';

export const SalesPage = styled.div`
    display:${(props)=>props.visible ? 'grid':'none'};
    gap:10px;

    & .searchItemDiv{
        background-color: var(--light);
        display:grid;
        place-items:center center;
        padding: 20px 10px;
        box-shadow:var(--default-shadow);
        border-radius:5px;
    }
    & .searchItemDiv>div{
        width:80%;
    }
    & .salesSection{
        display:grid;
        grid-template-columns: 1.5fr 1fr;
        gap:5px;
    }
    & .cartSection{
        padding:5px;
        min-height: 85vh;
        box-shadow:var(--default-shadow);
        background-color: var(--light-gray);
    }
    & .itemsForSale{
        margin-top:20px;
    }
    & .itemsForSale h3{
        text-align:center;
    }
    & .cartItems td.currency{
        text-align:right;
    }
    & .cartItems td.table-action-btns{
        text-align:center;
    }
    & .cartItems td.p_qty{
        display:flex;
        justify-content:center;
        align-items:center;
    }
    & .cartItems td.p_qty button{
        cursor:pointer;
    }
    & .cartItems td input{
        width:50px;
        font-size:0.8em;
        text-align:center;
        padding:10px 0px;
    }
    & .cartItems h5{
        text-align:center;
        margin-top:10px;
    }
    & .cartItems .cartSummary{
        margin-top:20px;
        display:grid;
        grid-template-columns: 1.5fr 1fr;
    }
    & .cartExtras #editDiscountFormField{
        grid-area:'discount';
    }
    & .cartExtras #editTaxFormField{
        grid-area:'tax';
    }
    & .cartExtras #editShippingFormField{
        grid-area:'shipping';
    }
    & .cartExtras #editSalesStatusFormField{
        grid-area:'salesStatus';
    }
    & .cartExtras #editPaymentStatusFormField{
        grid-area:'paymentStatus';
    }
    & .cartExtras #editNoteFormField{
        grid-area:'note';
    }
    & .cartExtras #checkoutCompleteSaleBtn{
        grid-area:'checkoutbtn';
    }
    & .cartExtras #clearSaleBtn{
        grid-area:'clearbtn';
    }
    & .cartExtras #editPaymentFormField{
        grid-area:'payments';
    }
    & .cartExtras{
        display:grid;
        grid-template-areas:'payments discount'
                            'tax shipping'
                            'salesStatus paymentStatus'
                            'checkoutbtn clearbtn';
        gap: 10px;
        margin: 5px;
    }
    & .nav-item a{
        color: aliceblue;
    }
`