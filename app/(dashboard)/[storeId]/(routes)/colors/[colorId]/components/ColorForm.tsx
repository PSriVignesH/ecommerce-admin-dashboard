"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import {Color} from '@prisma/client'
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


interface ColorFormProps{
  initialData:Color | null  
}

const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(4).regex(/^#/,{
    message:"String must be avalid hex code"
  })
})

type ColorFormValues = z.infer<typeof formSchema>

const ColorForm:FC<ColorFormProps>= ({initialData}) => {
   const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)


  const title = initialData ? "Edit color" : "Create color"
  const description = initialData ? "Edit a color." : "Add a new color"
  const toastMessage = initialData ? "Color updated" : 'Color created'
  const action = initialData ? "Save changes" : "Create"
   
  
  const form = useForm<ColorFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
      name:"",
      value:""
    }
  })

  const onSubmit =async (values:ColorFormValues)=>{
   try {
    setIsloading(true)

    if(initialData){
      await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`,values)
    }else {
      await axios.post(`/api/${params.storeId}/colors`, values);
    }
    
    router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      
      router.push(`/${params.storeId}/colors`);
      toast.success('Color deleted.');
      router.refresh();
    } catch (error:any) {
      toast.error('Make sure you removed all products using this color first.');
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
                <Input disabled={isLoading} placeholder="Color name" {...field} />
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
                <div className='flex items-center gap-x-4'>
                <Input disabled={isLoading} placeholder="Color Value" {...field} />
                <div className='border p-4 rounded-full' style={{backgroundColor:field.value}}/>
                </div>
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

export default ColorForm