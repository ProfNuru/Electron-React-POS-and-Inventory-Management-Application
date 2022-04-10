import styled from 'styled-components';

export const ThermalPrintTemplate = styled.div`

  box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5);
  padding:2mm;
  margin: 0 auto;
  width: 60mm;
  background: #FFF;


    ::selection {background: #f31544; color: #FFF;}
    h1{
        font-size: 1.5em;
        color: #222;
    }
    h2{font-size: .9em;}
    h3{
        font-size: 1.2em;
        font-weight: 300;
        line-height: 2em;
    }
    h4{
        font-size: 1.2em;
        font-weight: 500;
        line-height: 2em;
    }
    p{
        font-size: .7em;
        color: #666;
        line-height: 1.2em;
    }

    #top, #mid,#bot{ /* Targets all id with 'col-' */
        border-bottom: 1px solid #EEE;
    }

    #top{min-height: 100px;}
    #mid{min-height: 80px;}
    #bot{ min-height: 50px;}

    #top .logo{
    //float: left;
        height: 60px;
        width: 60px;
        /* background: url(http://michaeltruong.ca/images/logo1.png) no-repeat; */
        background-size: 60px 60px;
    }
    .clientlogo{
        float: left;
        height: 60px;
        width: 60px;
        /* background: url(http://michaeltruong.ca/images/client.jpg) no-repeat; */
        background-size: 60px 60px;
        border-radius: 50px;
    }
    .info{
        display: block;
        //float:left;
        margin-left: 0;
    }
    .title{
        float: right;
    }
    .title p{text-align: right;}
    table{
        width: 100%;
        border-collapse: collapse;
    }
    td{
    //padding: 5px 0 5px 15px;
    //border: 1px solid #EEE
    }
    .tabletitle{
        //padding: 5px;
        font-size: .5em;
        background: #EEE;
    }
    .service{border-bottom: 1px solid #EEE;}
    .item{width: 24mm;}
    .itemtext{font-size: .5em;}

    #legalcopy{
        margin-top: 5mm;
    }

`