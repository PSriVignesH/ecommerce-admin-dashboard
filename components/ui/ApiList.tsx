"use client"

import { useParams } from 'next/navigation';
import React, { FC } from 'react'

import { useOrigin } from '@/hooks/useOrigin';
import ApiAlert from '@/components/ui/ApiAlert';

interface ApiListProps{
  entityName:string,
  entityIdName:string
}
const ApiList:FC<ApiListProps>= ({entityName,entityIdName}) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
   <>
   <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}`}/>
   <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>
   <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`}/>
   <ApiAlert title='PATCH' variant='admin'  description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>
   <ApiAlert title='DELETE' variant='admin'  description={`${baseUrl}/${entityName}/{${entityIdName}}`}/>
   </>
  )
}

export default ApiList