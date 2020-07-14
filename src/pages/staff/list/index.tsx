import React from 'react'
import { Redirect,  useAccess  } from 'umi'
import ListLayer from './list'
interface UserProp {
  history: any;
  location: any;
}
const StaffList: React.FC<UserProp> = (props) => {
  const access = useAccess();
  if (!access.STAFF_LIST) {
    return <Redirect to="/404" />
  }
  return (
    <ListLayer history={props.history} location={props.location}/>
  )
}
export default StaffList
