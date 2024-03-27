"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import { Billboard, Category} from '@prisma/client'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


interface CategoryFormProps{
  initialData:Category | null,
  billboards:Billboard[]
}

const formSchema = z.object({
  name:z.string().min(1),
  billboardId:z.string().min(1)
})

type CategoryFormValues = z.infer<typeof formSchema>

const CategoryForm:FC<CategoryFormProps>= ({initialData,billboards}) => {
   const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)


  const title = initialData ? "Edit category" : "Create category"
  const description = initialData ? "Edit a category." : "Add a new category."
  const toastMessage = initialData ? "Category updated" : 'Category created'
  const action = initialData ? "Save changes" : "Create"
   
  
  const form = useForm<CategoryFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
      name:"",
      billboardId:""
    }
  })

  const onSubmit =async (values:CategoryFormValues)=>{
   try {
    setIsloading(true)

    if(initialData){
      await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,values)
    }else {
      await axios.post(`/api/${params.storeId}/categories`, values);
    }
    
    router.push(`/${params.storeId}/categories`);
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
      await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
      router.push(`/${params.storeId}/categories`);
      router.refresh();
      toast.success('Category deleted.');
    } catch (error:any) {
      toast.error('Make sure you removed all products using this category first.');
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
                <Input disabled={isLoading} placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard:any) => (
                        <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm