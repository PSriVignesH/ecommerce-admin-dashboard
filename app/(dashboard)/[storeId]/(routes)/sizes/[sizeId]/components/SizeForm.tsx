"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import {Size} from '@prisma/client'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import toast from 'react-hot-toast'


import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AlertModal from '@/components/modals/AlertModal'
import ImageUpload from '@/components/ui/ImageUpload'


interface SizeFormProps{
  initialData:Size | null  
}

const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(1)
})

type SizeFormValues = z.infer<typeof formSchema>

const SizeForm:FC<SizeFormProps>= ({initialData}) => {
   const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)


  const title = initialData ? "Edit size" : "Create size"
  const description = initialData ? "Edit a size." : "Add a new size"
  const toastMessage = initialData ? "Size updated" : 'Size created'
  const action = initialData ? "Save changes" : "Create"
   
  
  const form = useForm<SizeFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
      name:"",
      value:""
    }
  })

  const onSubmit =async (values:SizeFormValues)=>{
   try {
    setIsloading(true)

    if(initialData){
      await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,values)
    }else {
      await axios.post(`/api/${params.storeId}/sizes`, values);
    }
    
    router.push(`/${params.storeId}/sizes`);
    toast.success(toastMessage);
    router.refresh();
   } catch (error:any) {
    toast.error('Something went wrong.');
   } finally{
   setIsloading(false)
   }
  }

  const onDelete = async()=>{
    try {
      setIsloading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      
      router.push(`/${params.storeId}/sizes`);
      toast.success('Size deleted.');
      router.refresh();
    } catch (error:any) {
      toast.error('Make sure you removed all products using this size first.');
    } finally{
      setIsloading(false)
      setIsOpen(false)
    }
  }
  return (
    <>
    <AlertModal isOpen={isOpen} onClose={()=>setIsOpen(false)} onConfirm={onDelete} loading={isLoading}/>
    <div className='flex items-center justify-between'>
      <Heading title={title} description={description}/>
      { 
       initialData && (
          <Button variant="destructive" size="icon" disabled={isLoading} onClick={()=>setIsOpen(true)}>
          <Trash className='h-4 w-4'/>
        </Button>
      ) 
      }
    </div>
    <Separator/>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>    
        <div className='grid grid-cols-3 gap-8'>
          <FormField 
          control={form.control} 
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Size name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField 
          control={form.control} 
          name='value'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Size Value" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <Button disabled={isLoading} className='ml-auto' type='submit'>
        {action}
        </Button>
      </form>
    </Form>
    <Separator />
    </>
  )
}

export default SizeForm