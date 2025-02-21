import React, { useEffect, useState } from "react";

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5001/api/get-orders")
            .then(response => response.json())
            .then(data => setOrders(data.orders || []))  // ✅ Ensure it's always an array
            .catch(error => console.error("Error fetching orders:", error));
    }, []);

    return (
        <div className="orders-container">
            <div className="orders-box">
               <table className="orders-table">
                    <thead>
                        <tr>
                        <th>User Name</th>
                         <th>Product Name</th>
                            <th>Payment ID</th>
                            <th>Quantity</th>
                            <th>Price</th>

                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={index}>
                                 <td>{order.username || "N/A"}</td>

                                    <td>{order.productName || "N/A"}</td>
                                    <td>{order.paymentId || "N/A"}</td>
                                    <td>{order.quantity ? order.quantity.replace(/\D/g, '') : "N/A"}</td>

                                    <td>{order.amount ? `₹${order.amount}` : "N/A"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>No orders available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersTable;
