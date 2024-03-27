import React, { FC, useState } from 'react'
import { Badge, BadgeProps } from './badge'
import toast from 'react-hot-toast'
import { Check, Copy, Server } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'


interface ApiAlertProps{
  title:string,
  description:string,
  variant:'public' | 'admin'
}


const textMap:Record<ApiAlertProps["variant"],string>= {
  public: 'Public',
  admin: 'Admin'
}

const variantMap:Record<ApiAlertProps["variant"],BadgeProps["variant"]> ={
  public:"secondary",
  admin:"destructive"
}
const ApiAlert:FC<ApiAlertProps>= ({title,description,variant="public"}) =>{
  const [isCopied, setIsCopied] = useState(false)

  const onCopy = (description:string)=>{
    navigator.clipboard.writeText(description);
    setIsCopied(true)
    toast.success('API Route copied to clipboard.');
    
    setTimeout(()=>{
      setIsCopied(false)
    },1000)
  }

  return (
   <Alert>
    <Server className='h-4 w-4'/>
    <AlertTitle className='flex items-center gap-x-2'>
      {title}
      <Badge variant={variantMap[variant]}>
      {textMap[variant]}
      </Badge>
    </AlertTitle>
    <AlertDescription className='mt-4 flex items-center justify-between'>
      <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
        {description}
      </code>
      <Button variant="outline" size="sm" onClick={()=>onCopy(description)}>
      {isCopied 
                ? <Check className="w-4 h-4 stroke-green-500 "/> 
                : <Copy className="w-4 h-4" />
              }
      </Button>
    </AlertDescription>
   </Alert>
  )
}

export default ApiAlert