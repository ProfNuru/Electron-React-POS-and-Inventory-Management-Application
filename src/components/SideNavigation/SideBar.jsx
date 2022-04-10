import React from 'react';
import {MainSideNav} from './SideBar.style';
import {SideBarButton} from './SideBarButton.style';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTachometerAverage,faCartShopping,faDatabase,
        faBoxesPacking,faChartLine, faGear, faChalkboardUser
      } from '@fortawesome/free-solid-svg-icons';

const SideBar = ({toggleWindows,pagesShown}) => {
  return (
    <MainSideNav>
        <SideBarButton active={pagesShown.showDashboard} onClick={()=>toggleWindows('showDashboard')}>
          <FontAwesomeIcon icon={faTachometerAverage}></FontAwesomeIcon>
          <small>Dashboard</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showPos} onClick={()=>toggleWindows('showPos')}>
          <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
          <small>Sales</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showInventory} onClick={()=>toggleWindows('showInventory')}>
          <FontAwesomeIcon icon={faDatabase}></FontAwesomeIcon>
          <small>Inventory</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showSuppliers} onClick={()=>toggleWindows('showSuppliers')}>
          <FontAwesomeIcon icon={faBoxesPacking}></FontAwesomeIcon>
          <small>Suppliers</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showSales} onClick={()=>toggleWindows('showSales')}>
          <FontAwesomeIcon icon={faChartLine}></FontAwesomeIcon>
          <small>Analytics</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showCustomers} onClick={()=>toggleWindows('showCustomers')}>
          <FontAwesomeIcon icon={faChalkboardUser}></FontAwesomeIcon>
          <small>Customers</small>
        </SideBarButton>
        <SideBarButton active={pagesShown.showSettings} onClick={()=>toggleWindows('showSettings')}>
          <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
          <small>Settings</small>
        </SideBarButton>
    </MainSideNav>
  )
}

export default SideBar