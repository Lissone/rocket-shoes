import { useState, useEffect } from 'react'
import { MdAddShoppingCart } from 'react-icons/md'

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

interface CartItemAmount {
  [key: number]: number
}

interface ProductFormatted extends Product {
  priceFormatted: string
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([])
  const { addProduct, cart } = useCart()

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount}
    newSumAmount[product.id] = product.amount

    return newSumAmount
  }, {} as CartItemAmount)

  useEffect(() => {

    async function loadProducts() {
      const response = await api.get<Product[]>('products')

      const products = response.data.map(product => ({
        ...product,
        priceFormatted: formatPrice(product.price)
      }))

      setProducts(products)
    }

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
              onClick={() => handleAddProduct(product.id)}
            >
              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>
                ADICIONAR AO CARRINHO
              </span>
            </button>
          </li>
        )
      })}
    </ProductList>
  )
}

export default Home