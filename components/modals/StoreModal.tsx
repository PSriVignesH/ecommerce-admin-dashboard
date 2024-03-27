"use client"

import React, { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { Modal } from '@/components/ui/modal'
import { useStoreModal } from '@/hooks/useStoreModal'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'


const formSchema =z.object({
  name:z.string().min(1)
})

const StoreModal = () => {
  const storeModal = useStoreModal()
  const [isLoading, setIsLoading] = useState(false)

const form = useForm<z.infer <typeof formSchema>>({
resolver:zodResolver(formSchema),
defaultValues:{
  name:""
}
})


const onSubmit =async(values:z.infer<typeof formSchema>)=>{
try {
  setIsLoading(true)
  const response = await axios.post("/api/stores",values)
  window.location.assign(`${response.data.id}`)
} catch (error) {
  toast.error("Something went wrong")
}
finally{
setIsLoading(false)
}

}
  return (
   <Modal  title="Create store" description='Add a new store to manage products and categories' isOpen={storeModal.isOpen} onClose={storeModal.onClose}>
    <div>
      <div className='space-y-2 py-2 pb-4'>
        <div className='space-y-2'>
          <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name='name'
              render={({field})=>(
                <FormItem>
                  <FormLabel>
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder='E-Commerce' {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              />
              <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                 <Button disabled={isLoading} variant="outline" onClick={storeModal.onClose}>Cancel</Button>
                 <Button disabled={isLoading} type='submit'>Continue</Button>
              </div>
             </form>
          </Form>
        </div>
      </div>
    </div>
   </Modal>
  )
}

export default StoreModal