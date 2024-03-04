/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { delete_product, get_products } from "../api/products";
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Loader from "./Loader";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Product } from "../Interfaces";
import Swal from "sweetalert2";

interface Props {
  results: any;
}

const Products = ({ results }: Props) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const {
    data,
    isLoading,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(["products"], get_products, {
    getNextPageParam: (page: any) => page.meta.next,
  });

  const queryClient = useQueryClient();

  const deleteProdMutation = useMutation({
    mutationFn: delete_product,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Producto eliminado con éxito");
    },
    onError: () => {
      toast.error("Error!");
    },
  });

  const confirmDelete = async (productId: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, bórralo!",
    });

    if (result.isConfirmed) {
      deleteProdMutation.mutate(productId);
    }
  };

  if (deleteProdMutation.isLoading) return <Loader />;
  if (error instanceof Error) return <>{toast.error(error.message)}</>;

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-black">
        <thead className="text-xs text-black uppercase bg-gray-50 dark:bg-gray-400 dark:text-black ">
          <tr>
            <th scope="col" className="px-4 py-3">
              ID Producto
            </th>
            <th scope="col" className="px-4 py-3">
              Nombre
            </th>

            <th scope="col" className="px-4 py-3">
              Precio
            </th>

            <th scope="col" className="px-4 py-3">
              Cantidad
            </th>

            <th scope="col" className="px-4 py-3 flex justify-center gap-4">
              Acciones
              <Link to="add">
                <AiFillPlusSquare
                  size={22}
                  className="text-green-300 cursor-pointer"
                />
              </Link>
            </th>
          </tr>
        </thead>

        {results && results.products.length > 0 ? (
          <>
            {results &&
              results.products.map((product: Product) => (
                <tbody>
                  <tr className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-4 py-3 font-medium text-black whitespace-nowrap dark:text-black"
                    >
                      {product.id}
                    </th>

                    <td className="px-4 py-3">{product.name}</td>

                    <td className="px-4 py-3">$ {product.price}</td>

                    <td className="px-4 py-3">{product.count_in_stock}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-4">
                        <BsFillTrashFill
                          onClick={() => {
                            if (product.id !== undefined) {
                              void confirmDelete(product.id);
                            }
                          }}
                          size={22}
                          className="text-red-300 cursor-pointer"
                        />

                        <Link to={`edit/${product.id}`}>
                          <AiFillEdit
                            size={22}
                            className="text-black cursor-pointer"
                          />
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
          </>
        ) : (
          <>
            {data?.pages.map((page: any) => (
              <>
                <tbody key={page.meta.next}>
                  {page.data.map((product: Product) => (
                    <tr className="border-b dark:border-gray-700">
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-black"
                      >
                        {product.id}
                      </th>

                      <td className="px-4 py-3">{product.name}</td>

                      <td className="px-4 py-3">$ {product.price}</td>

                      <td className="px-4 py-3">{product.count_in_stock}</td>

                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-4">
                        <BsFillTrashFill
                          onClick={() => {
                            if (product.id !== undefined) {
                              void confirmDelete(product.id);
                            }
                          }}
                          size={22}
                          className="text-red-300 cursor-pointer"
                        />

                          <Link to={`edit/${product.id}`}>
                            <AiFillEdit
                              size={22}
                              className="text-blue-500 cursor-pointer"
                            />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

                {!isLoading && data?.pages.length === 0 && (
                  <p className="text-xl text-slate-800 dark:text-black">
                    No hay mas resultados
                  </p>
                )}
                {!isLoading &&
                  data?.pages?.length !== undefined &&
                  data.pages.length > 0 &&
                  hasNextPage && (
                    <div ref={ref}>
                      {isLoading || isFetchingNextPage ? <Loader /> : null}
                    </div>
                  )}
              </>
            ))}
          </>
        )}
      </table>
    </div>
  );
};
export default Products;
