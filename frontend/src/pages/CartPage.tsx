import { useCartStore } from "../store/cart"
import { useState } from "react"
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { create_order } from "../api/orders"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js"

const CartPage = () => {
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  )
  const addToCart = useCartStore(
    (state) => state.addToCart
  )
  const removeAll = useCartStore(
    (state) => state.removeAll
  )

  const cart = useCartStore((state) => state.cart)
  const total_price = useCartStore(
    (state) => state.totalPrice
  )

  const [address, setAddress] =
    useState<string>("")
  const [city, setCity] = useState<string>("")
  const [postal_code, setPostal_code] =
    useState<string>("")

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createOrderMut = useMutation({
    mutationFn: create_order,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      })
      toast.success("Order created!")
      removeAll()
      navigate("/")
    },
    onError: () => {
      toast.error("Error!")
      navigate("/")
    },
  })

  const createOrder = (
    data: any,
    actions: any
  ) => {
    console.log(data)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total_price,
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
      },
    })
  }

  const onApprove = (data: any, actions: any) => {
    console.log(data)
    return actions.order.capture(handleSubmit())
  }

  const handleSubmit = () => {
    createOrderMut.mutate({
      order_items: cart,
      total_price: total_price,
      address: address,
      city: city,
      postal_code: postal_code,
    })
  }

  return (
    // <>
    //   <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
    //     <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
    //       <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
    //         <div className="relative mt-5 overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
    //           <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
    //             <div className="flex items-center flex-1 space-x-4">
    //               <h5>
    //                 <span className="text-gray-300 text-xl font-bold">
    //                   Products in you cart: {cart.length}
    //                 </span>
    //               </h5>
    //               <h5>
    //                 <span className="text-gray-300 text-xl font-bold">
    //                   Total: {total_price === null && "0"} $ {total_price}
    //                 </span>
    //               </h5>
    //             </div>
    //           </div>
    //           <div className="overflow-x-auto">
    //             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    //               <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
    //                 <tr>
    //                   <th scope="col" className="px-4 py-3">
    //                     Product
    //                   </th>
    //                   <th scope="col" className="px-4 py-3">
    //                     Category
    //                   </th>
    //                   <th scope="col" className="px-4 py-3">
    //                     Quantity
    //                   </th>
    //                   <th scope="col" className="px-4 py-3">
    //                     Price
    //                   </th>
    //                   <th scope="col" className="px-4 py-3">
    //                     Total
    //                   </th>
    //                 </tr>
    //               </thead>
    //               <tbody>
    //                 {cart.map((product) => (
    //                   <>
    //                     <tr
    //                       key={product.id}
    //                       className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
    //                     >
    //                       <th
    //                         scope="row"
    //                         className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    //                       >
    //                         <img
    //                           src={`http://127.0.0.1:8000${product.image}`}
    //                           alt={product.name}
    //                           className="w-auto h-8 mr-3"
    //                         />

    //                         {product.name}
    //                       </th>
    //                       <td className="px-4 py-2">
    //                         <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
    //                           {product.category}
    //                         </span>
    //                       </td>
    //                       <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                         <div className="flex items-center space-x-3">
    //                           <button
    //                             onClick={() => removeFromCart(product)}
    //                             className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    //                             type="button"
    //                           >
    //                             <span className="sr-only">Quantity button</span>
    //                             <svg
    //                               className="w-4 h-4"
    //                               aria-hidden="true"
    //                               fill="currentColor"
    //                               viewBox="0 0 20 20"
    //                               xmlns="http://www.w3.org/2000/svg"
    //                             >
    //                               <path
    //                                 fill-rule="evenodd"
    //                                 d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
    //                                 clip-rule="evenodd"
    //                               ></path>
    //                             </svg>
    //                           </button>
    //                           <div>
    //                             {product.quantity}
    //                             <input
    //                               type="number"
    //                               id="first_product"
    //                               className="hidden bg-gray-50 w-14 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2.5 py-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //                               placeholder="1"
    //                               required
    //                             />
    //                           </div>
    //                           <button
    //                             onClick={() => addToCart(product)}
    //                             className="inline-flex items-center p-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    //                             type="button"
    //                           >
    //                             <span className="sr-only">Quantity button</span>
    //                             <svg
    //                               className="w-4 h-4"
    //                               aria-hidden="true"
    //                               fill="currentColor"
    //                               viewBox="0 0 20 20"
    //                               xmlns="http://www.w3.org/2000/svg"
    //                             >
    //                               <path
    //                                 fill-rule="evenodd"
    //                                 d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
    //                                 clip-rule="evenodd"
    //                               ></path>
    //                             </svg>
    //                           </button>
    //                         </div>
    //                       </td>
    //                       <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                         ${product.price}
    //                       </td>

    //                       <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
    //                         ${" "}
    //                         {product.quantity !== undefined
    //                           ? product.price * product.quantity
    //                           : 0}
    //                       </td>
    //                     </tr>
    //                   </>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </div>
    //       </div>

    //       <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
    //         <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
    //           Shipping address
    //         </h1>
    //         <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
    //           <div>
    //             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //               Address
    //             </label>
    //             <input
    //               onChange={(e) => setAddress(e.target.value)}
    //               value={address}
    //               type="text"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               placeholder="Address"
    //             />
    //           </div>

    //           <div>
    //             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //               City
    //             </label>
    //             <input
    //               onChange={(e) => setCity(e.target.value)}
    //               value={city}
    //               type="text"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               placeholder="Address"
    //             />
    //           </div>

    //           <div>
    //             <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
    //               Postal code
    //             </label>
    //             <input
    //               onChange={(e) => setPostal_code(e.target.value)}
    //               value={postal_code}
    //               type="text"
    //               className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    //               placeholder="Address"
    //             />
    //           </div>

    //           <div className="ml-[180px]">
    //             <PayPalScriptProvider
    //               options={{
    //                 clientId: "",
    //                 currency: "USD",
    //               }}
    //             >
    //               <PayPalButtons
    //                 createOrder={(data, actions) => createOrder(data, actions)}
    //                 onApprove={(data, actions) => onApprove(data, actions)}
    //                 style={{ layout: "horizontal" }}
    //               />
    //             </PayPalScriptProvider>
    //           </div>
    //         </form>
    //       </div>
    //     </div>
    //   </section>
    // </>
    <>
      <div
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
        data-v0-t="card"
      >
        <div className="space-y-1.5 p-6 flex flex-col md:flex-row md:items-center md:gap-4">
          <div className="font-semibold text-xl">
            Carrito
          </div>
          <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 ml-auto w-[140px] md:ml-auto">
            Ir a la tienda
          </button>
        </div>
        <div className="p-0">
          <div className="border-t">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&amp;_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Producto(s)
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Categoria
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-24">
                      Cantidad
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Precio
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="[&amp;_tr:last-child]:border-0">
                  {cart.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-t"
                    >
                      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        <div className="flex items-center gap-4">
                          <img
                            src={`http://127.0.0.1:8000${product.image}`}
                            width="64"
                            height="64"
                            alt={product.name}
                            className="aspect-square rounded-md object-cover"
                          />
                          <div className="font-medium">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        {product.category}
                      </td>
                      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        {product.quantity}
                      </td>
                      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        ${product.price}
                      </td>
                      <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                        ${" "}
                        {product.quantity !==
                        undefined
                          ? product.price *
                            product.quantity
                          : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="items-center p-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2">
              Subtotal{" "}
              <span className="ml-auto"></span>
            </p>
            <p className="flex items-center gap-2">
              Taxes{" "}
              <span className="ml-auto">
                $24.80
              </span>
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background 
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full 
          md:w-auto"
          >
            Comprar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black">
          Dirección de envío
        </h1>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Domicilio
            </label>
            <textarea
              onChange={(e) =>
                setAddress(e.target.value)
              }
              value={address}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 
              focus:border-primary-600 block w-full p-2.5"
              placeholder="Domicilio"
            ></textarea>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Ciudad
            </label>
            <input
              onChange={(e) =>
                setCity(e.target.value)
              }
              value={city}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 
              focus:border-primary-600 block w-full p-2.5"
              placeholder="Ciudad"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-black">
              Codigo Postal
            </label>
            <input
              onChange={(e) =>
                setPostal_code(e.target.value)
              }
              value={postal_code}
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 
              focus:border-primary-600 block w-full p-2.5"
              placeholder="Codigo postal"
            />
          </div>

          <div className="ml-[180px]">
            <PayPalScriptProvider
              options={{
                clientId: "",
                currency: "USD",
              }}
            >
              <PayPalButtons
                createOrder={(data, actions) =>
                  createOrder(data, actions)
                }
                onApprove={(data, actions) =>
                  onApprove(data, actions)
                }
                style={{ layout: "horizontal" }}
              />
            </PayPalScriptProvider>
          </div>
        </form>
      </div>
    </>
  )
}

export default CartPage
