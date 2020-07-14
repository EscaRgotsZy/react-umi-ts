import React from 'react'
import { Redirect,  useAccess  } from 'umi'
import OccupationLayer from './occupation'
interface UserProp {
  history: any;
  location: any;
}
const StaffList: React.FC<UserProp> = (props) => {
  const access = useAccess();
  if (!access.STAFF_OCCUPATION) {
    return <Redirect to="/404" />
  }
  return (
    <OccupationLayer history={props.history} location={props.location}/>
  )
}
export default StaffList
