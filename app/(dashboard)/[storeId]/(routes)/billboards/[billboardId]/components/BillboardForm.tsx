"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import { Billboard} from '@prisma/client'
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


interface BillboardFormProps{
  initialData:Billboard | null
}

const formSchema = z.object({
  label:z.string().min(1),
  imageUrl:z.string().min(1)
})

type BillboardFormValues = z.infer<typeof formSchema>

const BillboardForm:FC<BillboardFormProps>= ({initialData}) => {
   const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)


  const title = initialData ? "Edit billboard" : "Create billboard"
  const description = initialData ? "Edit a billboard." : "Add a new billboard"
  const toastMessage = initialData ? "Billboard updated" : 'Billboard created'
  const action = initialData ? "Save changes" : "Create"
   
  
  const form = useForm<BillboardFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
      label:"",
      imageUrl:""
    }
  })

  const onSubmit =async (values:BillboardFormValues)=>{
   try {
    setIsloading(true)

    if(initialData){
      await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,values)
    }else {
      await axios.post(`/api/${params.storeId}/billboards`, values);
    }
    
    router.push(`/${params.storeId}/billboards`);
    router.refresh();
    toast.success(toastMessage);
   } catch (error:any) {
    toast.error('Something went wrong.');
   } finally{
   setIsloading(false)
   }
  }

  const onDelete = async()=>{
    try {
      setIsloading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      
      router.push(`/${params.storeId}/billboards`);
      toast.success('Billboard deleted.');
      router.refresh();
    } catch (error:any) {
      toast.error('Make sure you removed all categories using this billboard first.');
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
      <FormField 
          control={form.control} 
          name='imageUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background image</FormLabel>
              <FormControl>
                <ImageUpload  
                value={field.value ? [field.value] : []}
                disabled={isLoading}
                onChange={(url)=>field.onChange(url)}
                onRemove={()=>field.onChange("")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        <div className='grid grid-cols-3 gap-8'>
          <FormField 
          control={form.control} 
          name='label'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Billboard label" {...field} />
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

export default BillboardForm