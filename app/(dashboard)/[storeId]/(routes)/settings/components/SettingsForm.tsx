"use client"

import React, { FC, useState } from 'react'
import { Trash } from 'lucide-react'
import { Store } from '@prisma/client'
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
import { useOrigin } from '@/hooks/useOrigin'
import ApiAlert from '@/components/ui/ApiAlert'


interface SettingsFormProps{
  initialData:Store
}

const formSchema = z.object({
  name:z.string().min(1)
})

type SettingsFormValues = z.infer<typeof formSchema>

const SettingsForm:FC<SettingsFormProps>= ({initialData}) => {
   const params = useParams()
   const router = useRouter()
  const origin = useOrigin()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading,setIsloading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData
  })

  const onSubmit =async (values:SettingsFormValues)=>{
   try {
    setIsloading(true)
    await axios.patch(`/api/stores/${params.storeId}`,values)
    router.refresh();
    toast.success('Store updated.');
   } catch (error:any) {
    toast.error('Something went wrong.');
   } finally{
   setIsloading(false)
   }
  }

  const onDelete = async()=>{
    try {
      setIsloading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh();
      router.push('/');
      toast.success('Store deleted.')
    } catch (error:any) {
      toast.error('Make sure you removed all products and categories first.');
    } finally{
      setIsloading(false)
      setIsOpen(false)
    }
  }
  return (
    <>
    <AlertModal isOpen={isOpen} onClose={()=>setIsOpen(false)} onConfirm={onDelete} loading={isLoading}/>
    <div className='flex items-center justify-between'>
      <Heading title="Settings" description="Manage store preferences"/>
      <Button variant="destructive" size="icon" disabled={isLoading} onClick={()=>setIsOpen(true)}>
        <Trash className='h-4 w-4'/>
      </Button>
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
                <Input disabled={isLoading} placeholder="Store name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
          />
        </div>
        <Button disabled={isLoading} className='ml-auto' type='submit'>
         Save Changes
        </Button>
      </form>
    </Form>
    <Separator />
    <ApiAlert 
        title="NEXT_PUBLIC_API_URL" 
        variant="public" 
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  )
}

export default SettingsForm