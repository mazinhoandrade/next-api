
import React from 'react'
import FormProduct from './components/formProduct'
import { getProducts } from '@/app/actions/get-product';
import { formatCentsToBRL } from '@/app/helpers/money';



const page = async () => {

  const products = await getProducts();
    
  return (
    <div className='container px-4 mx-auto'>
        <h1>Produtos</h1>
        {
          products.map((product) => (
            <p key={product.id}> {formatCentsToBRL(product.amount)} - {product.description}</p>
          ))
        }
        {products.length === 0 && <p>Não existem produtos cadastrados</p>}
        <h1>Novo produto</h1>
        <FormProduct />
    </div>
  )
}

export default page