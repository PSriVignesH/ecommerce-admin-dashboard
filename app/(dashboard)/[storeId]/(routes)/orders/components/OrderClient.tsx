"use client"


import React, { FC } from 'react'


import { OrderColumn, columns } from './columns'
import Heading from '@/components/ui/Heading'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/DataTable'
interface OrderClientProps{
  data:OrderColumn[]
}

const OrderClient:FC<OrderClientProps>= ({data}) => {
  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage orders for you store"/> 
    <Separator/>
      <DataTable searchKey='products' columns={columns} data={data}/>
    </>
  )
}

export default OrderClient