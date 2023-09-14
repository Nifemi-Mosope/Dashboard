// PageContent.js
import React from 'react';
import Dashboard from '../../MainCode/SideBarLinkPage/Dashboard';
import Orders from '../../MainCode/SideBarLinkPage/Order';
import History from '../../MainCode/SideBarLinkPage/OrderHistory';
import Reviews from '../../MainCode/SideBarLinkPage/Reviews';
import Menus from '../../MainCode/SideBarLinkPage/Menu';

function PageContent({ selectedMenuItem }) {
  return (
    <div className='PageContent'>
      {selectedMenuItem === '/dashboard' && <Dashboard />}
      {selectedMenuItem === '/orders' && <Orders />}
      {selectedMenuItem === '/orderhistory' && <History />}
      {selectedMenuItem === '/reviews' && <Reviews />}
      {selectedMenuItem === '/menus' && <Menus />}
    </div>
  );
}

export default PageContent;
