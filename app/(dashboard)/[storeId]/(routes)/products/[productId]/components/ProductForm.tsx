"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import {Category, Color, Image, Product, Size} from '@prisma/client'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios' 
import toast from 'react-hot-toast'


import Heading from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AlertModal from '@/components/modals/AlertModal'
import ImageUpload from '@/components/ui/ImageUpload'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'


interface ProductFormProps{
  initialData:Product & {
    images:Image[],
  } | null,
  categories:Category[],
  colors:Color[],
  sizes:Size[]
}

const formSchema = z.object({
  name:z.string().min(1),
  images:z.object({url:z.string()}).array(),
  price:z.coerce.number().min(1),
  categoryId:z.string().min(1),
  colorId:z.string().min(1),
  sizeId:z.string().min(1),
  isFeatured:z.boolean().default(false).optional(),
  isArchived:z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

const ProductForm:FC<ProductFormProps>= ({initialData,colors,categories,sizes}) => {
   const params = useParams()
   const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)


  const title = initialData ? "Edit product" : "Create product"
  const description = initialData ? "Edit a product." : "Add a new product"
  const toastMessage = initialData ? "Product updated" : 'Product created'
  const action = initialData ? "Save changes" : "Create"
   
  
  const form = useForm<ProductFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData ? {
      ...initialData,
      price:parseFloat(String(initialData?.price))
    } : {
      name:"",
      images:[],
      price:0,
      categoryId:"",
      colorId:"",
      sizeId:"",
      isFeatured:false,
      isArchived:false
    }
  })

  const onSubmit =async (values:ProductFormValues)=>{
   try {
    setIsloading(true)

    if(initialData){
      await axios.patch(`/api/${params.storeId}/products/${params.productId}`,values)
    }else {
      await axios.post(`/api/${params.storeId}/products`,values);
    }
    
    router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
      
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
      router.refresh();
    } catch (error:any) {
      toast.error('Something went wrong.');
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)} 
                    disabled={isLoading} 
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current:any) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className='grid grid-cols-3 gap-8'>
          <FormField 
          control={form.control} 
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input disabled={isLoading} placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField 
          control={form.control} 
          name='price'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input disabled={isLoading} type='number' placeholder="9.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
          <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField 
          control={form.control} 
          name='isFeatured'
          render={({ field }) => (
            <FormItem className=' flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
               <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>
                  Featured
                </FormLabel>
                <FormDescription>
                  This product will appear on home page
                </FormDescription>
              </div> 
            </FormItem>
          )}
          />
          <FormField 
          control={form.control} 
          name='isArchived'
          render={({ field }) => (
            <FormItem className=' flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
              <FormControl>
               <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel>
                  Archived
                </FormLabel>
                <FormDescription>
                  This product will not appear anywhere on the store
                </FormDescription>
              </div> 
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

export default ProductForm