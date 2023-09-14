export const getOrders = () => {
    return(
        fetch('https://dummyjson.com/carts').then(res => res.json())
    )
}