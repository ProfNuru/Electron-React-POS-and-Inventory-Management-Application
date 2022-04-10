import styled from 'styled-components';

export const SideBarButton = styled.button`
    display:flex;
    flex-direction:column;
    align-items:center;
    width:100%;
    padding:3px;
    background-color: ${(props)=>{return props.active ? 'var(--light-grey)': 'var(--dark-shade)'}};
    font-size: 2.5em;
    color:${(props)=>{return props.active ? 'var(--dark-shade);': 'var(--light)'}};
    border:none;
    text-decoration: none;
    transition: 0.5s all;

    & small{
        font-size:0.3em;
    }
    &:hover{
        background-color: var(--light-grey);
        color: var(--dark-shade);
    }
    &:active{
        background-color: var(--light-grey);
        color: var(--dark-shade);
    }
`