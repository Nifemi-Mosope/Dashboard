import React from 'react';
import Dashboard from '../../MainCode/SideBarLinkPage/Others/Dashboard';
import Orders from '../../MainCode/SideBarLinkPage/Orders/Order';
import History from '../../MainCode/SideBarLinkPage/Orders/OrderHistory';
import Reviews from '../../MainCode/SideBarLinkPage/Reviews/Reviews';
import Menus from '../../MainCode/SideBarLinkPage/Menus/Menu';
import Settings from '../../MainCode/SideBarLinkPage/Others/Settings';

function PageContent({ selectedMenuItem }) {
  return (
    <div className='PageContent'>
      {selectedMenuItem === '/dashboard' && <Dashboard />}
      {selectedMenuItem === '/orders' && <Orders />}
      {selectedMenuItem === '/orderhistory' && <History />}
      {selectedMenuItem === '/reviews' && <Reviews />}
      {selectedMenuItem === '/menus' && <Menus />}
      {selectedMenuItem === '/settings' && <Settings />}
    </div>
  );
}

export default PageContent;