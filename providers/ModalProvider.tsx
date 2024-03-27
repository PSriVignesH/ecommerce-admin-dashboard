"use client"
import StoreModal from '@/components/modals/StoreModal'
import React, { useEffect, useState } from 'react'

const ModalProvider = () => {

const [isMounted, setIsMounted] = useState(false)

useEffect(()=>{
setIsMounted(true)
},[])

if(!isMounted){
  return true
}
  return (
    <>
    <StoreModal/>
    </>
  )
}

export default ModalProvider