import React from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const PrivateRoot = ({children})=> {
const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
if (!isLoggedIn) {
return <Navigate to='/Login' replace></Navigate>
}
return children;
}
export default PrivateRoot