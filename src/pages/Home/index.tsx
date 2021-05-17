import { useState, useEffect } from 'react'
import { MdAddShoppingCart } from 'react-icons/md'
// import { IoMdAlert } from 'react-icons/io'

import { api } from '../../services/api'
import { formatPrice } from '../../util/format'
import { useCart } from '../../hooks/useCart'

import { ProductList } from './styles'

interface Product {
  id: number
  title: string
  price: number
  image: string
}

interface ProductFormatted extends Product {
  priceFormatted: string
  inStockAmount: number
}

interface StockProduct {
  id: number
  amount: number
}

export const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([])
  const [stockProducts, setStockProducts] = useState<StockProduct[]>([])
  const { addProduct } = useCart()

  useEffect(() => {
    async function loadProductsAmountInStock() {
      await api.get<StockProduct[]>('stock')
        .then(response => {
          setStockProducts(response.data)
        })
    }

    async function loadProducts() {
      const response = await api.get<Product[]>('products')

      const products = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price),
        inStockAmount: stockProducts[product.id-1]?.amount || 0
      }))

      setProducts(products)
    }

    loadProductsAmountInStock()
    loadProducts()
  }, [])



  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(product => {
        return (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              disabled={product.inStockAmount === 0}
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {product.inStockAmount}
              </div>

              <span>
                {product.inStockAmount > 0 ? 'ADICIONAR AO CARRINHO' : 'PRODUTO INDISPONÍVEL'}
              </span>
            </button>
          </li>
        )
      })}
    </ProductList>
  )
}