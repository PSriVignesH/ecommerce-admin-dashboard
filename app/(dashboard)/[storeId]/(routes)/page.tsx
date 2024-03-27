import { getGraphRevenue } from '@/actions/getGraphRevenue'
import { getSalesCount } from '@/actions/getSalesCount'
import { getStockCount } from '@/actions/getStockCount'
import { getTotalRevenue } from '@/actions/getTotalRevenue'
import Overview from '@/components/Overview'
import Heading from '@/components/ui/Heading'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CreditCard, DollarSign, Package } from 'lucide-react'
import React, { FC } from 'react'

interface DashboardPageProps{
  params:{storeId:string}
}

const DashboardPage:FC<DashboardPageProps> = async({params}) => {

   const totalRevenue = await getTotalRevenue(params.storeId)
   const salesCount = await getSalesCount(params.storeId)
   const stockCount =await getStockCount(params.storeId)
   const graphRevenue =await getGraphRevenue(params.storeId)
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
         <Heading title='Dashboard' description='Overview of your store'/>
         <Separator/>
         <div className='grid gap-4 grid-cols-3'>
           <Card>
             <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                 <CardTitle className='text-sm font-medium'>
                    Total Revenue
                 </CardTitle>
                 <DollarSign className='h-4 w-4 text-muted-foreground'/>
             </CardHeader>
             <CardContent>
               <div className='text-2xl font-bold'>
                    ${totalRevenue}
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                 <CardTitle className='text-sm font-medium'>
                    Sales
                 </CardTitle>
                 <CreditCard className='h-4 w-4 text-muted-foreground'/>
             </CardHeader>
             <CardContent>
               <div className='text-2xl font-bold'>
                    +{salesCount}
               </div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                 <CardTitle className='text-sm font-medium'>
                    Products InStock
                 </CardTitle>
                 <Package className='h-4 w-4 text-muted-foreground'/>
             </CardHeader>
             <CardContent>
               <div className='text-2xl font-bold'>
                    {stockCount}
               </div>
             </CardContent>
           </Card>
           <Card className='col-span-4'>
             <CardHeader>
                 <CardTitle className='text-sm font-medium'>
                    Overview
                 </CardTitle>
             </CardHeader>
             <CardContent className='pl-2'>
               <Overview data={graphRevenue}/>
             </CardContent>
           </Card>
         </div>
      </div>
    </div>
  )
}

export default DashboardPage