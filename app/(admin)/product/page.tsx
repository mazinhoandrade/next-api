
import React from 'react'
import FormProduct from './components/formProduct'
import { getProducts } from '@/app/actions/get-product';
import { formatCentsToBRL } from '@/app/helpers/money';
import { createProductType } from '@/app/types/product';



const page = async () => {

  const products: createProductType[] = await getProducts();
    
  return (
    <div className='container px-4 mx-auto'>
        <h1>Produtos</h1>
      {products.map((product) => (
        <p key={product.id}>
        {formatCentsToBRL(product.amount)} - {product.description}
        </p>
       ))}
        <h1>Novo produto</h1>
        <FormProduct />
    </div>
  )
}

export default page