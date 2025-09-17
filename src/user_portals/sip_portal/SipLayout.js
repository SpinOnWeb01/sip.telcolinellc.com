import { Outlet } from "react-router-dom";
import SipSidebar from "./SipSidebar";
import Header from './Header';

function SipLayout({colorThem,handleClick, mockDataTeam, radioValue}) {
  return (
    <>
    <div className={`App ${colorThem} `}>
      <Header colorThem={colorThem} handleClick={handleClick} mockDataTeam={mockDataTeam} radioValue={radioValue}/>
      <SipSidebar colorThem={colorThem} />
      <Outlet />
      </div>
    </>
  )
}

export default SipLayout