import styled from 'styled-components';

export const A4PrintTemplate = styled.div`
h1{text-align:center}.businessDetails{text-align:center;color:#555;font-size:0.8em;margin:0px}
#invoiceDetails{display:flex;justify-content:space-between;margin:0px;}
#invoiceItemsTable{display:flex}#invoiceItemsTable table{width:100%;border-collapse: collapse;}
#invoiceItemsTable table thead th{text-align:left;border-bottom:2px solid black}
#invoiceItemsTable table td{border-bottom:1px solid #ccc; padding:5px}
#invoiceItemsTable table tfoot td{border:none;font-weight:bolder;}
.invoiceFootTitles{text-align:right;padding-right:20px}
#invoiceEndMatter{display:flex;justify-content:space-between;align-items:center}
#invoiceEndMatter p{max-width:40%}.grandTotalEmphasis{text-transform:upper;font-size:1.4em}`