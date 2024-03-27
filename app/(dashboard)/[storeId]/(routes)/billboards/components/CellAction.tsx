"use client"

import React, { FC, useState } from 'react'
import { BillboardColumn } from './columns'
import toast from 'react-hot-toast'
import { Check, Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'


import AlertModal from '@/components/modals/AlertModal'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface CellActionProps{
  data:BillboardColumn
}

const CellAction:FC<CellActionProps>= ({data}) => {
  const [isCopied, setIsCopied] = useState(false)
  const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)
  
    const onConfirm = async () => {
      try {
        setIsloading(true);
        await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
        toast.success('Billboard deleted.');
        router.refresh();
      } catch (error) {
        toast.error('Make sure you removed all categories using this billboard first.');
      } finally {
        setIsOpen(false);
        setIsloading(false);
      }
    };

  const onCopy = (id:string)=>{
    navigator.clipboard.writeText(id);
    setIsCopied(true)
    toast.success('Billboard ID copied to clipboard.');
    
    setTimeout(()=>{
      setIsCopied(false)
    },1000)
  }


  
  return (
    <>
    <AlertModal 
    isOpen={isOpen}
    onClose={()=>setIsOpen(false)}
    onConfirm={onConfirm}
    loading={isLoading}
    />
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4'/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>
          Actions
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          { isCopied 
              ? <Check className="w-4 h-4 mr-2 stroke-green-500 "/> 
              : <Copy className="w-4 h-4 mr-2" />
          } Copy Id
        </DropdownMenuItem>
         <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/billboards/${data.id}`)}>
            <Edit className="w-4 h-4 mr-2" /> Update
         </DropdownMenuItem>
         <DropdownMenuItem onClick={()=>setIsOpen(true)}>
            <Trash className="w-4 h-4 mr-2" /> Delete
         </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  )
}

export default CellAction