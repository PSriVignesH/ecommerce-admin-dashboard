"use client"

import { useParams, useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import React, { FC } from 'react'


import { ProductColumn, columns } from './columns'
import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/DataTable'
import ApiList from '@/components/ui/ApiList'

interface ProductClientProps{
  data:ProductColumn[]
}

const ProductClient:FC<ProductClientProps>= ({data}) => {
  const router = useRouter()
  const params =useParams()
  return (
    <>
    <div className='flex items-center justify-between'>
      <Heading title={`Products (${data.length})`} description="Manage products for you store"/>
      <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
        <Plus className='mr-2 h-4 w-4'/>
        Add New
      </Button>    
    </div>
    <Separator/>
      <DataTable searchKey='name' columns={columns} data={data}/>
      <Heading title='API' description='API calls for Products'/>
      <Separator/>
      <ApiList entityName="products" entityIdName="productId"/>
    </>
  )
}

export default ProductClient