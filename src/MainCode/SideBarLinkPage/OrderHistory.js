import { Card, Table, Tag, Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function History() {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');

    const orders = [
        {
            "orderID": "F8762",
            "price": 600,
            "foodDetails": "Jollof Rice, Fried Rice, Yoghurt, Beans",
            "description": "Put the Beans in the nylon",
            "status": "Attended",
            "date": "Wed, 18th December 2023"
        },
        {
            "orderID": "R5678",
            "price": 800,
            "foodDetails": "Jollof Rice, Fried Rice, Yoghurt, Beans",
            "description": "Nil",
            "status": "Delayed or Declined",
            "date": "Wed, 18th December 2023"
        },
            {
                "orderID": "Y8585",
                "price": 800,
                "foodDetails": "Jollof Rice, Fried Rice, Yoghurt, Beans",
                "description": "Put the Beans in the nylon",
                "status": "Pending",
                "date": "Wed, 18th December 2023"
            }
    ];

    const renderOrderStatus = (orderStatus) => {
        if (orderStatus === 'Attended') {
            return <Tag color={'green'}>{orderStatus}</Tag>
        }
        if (orderStatus === 'Pending') {
            return <Tag color={'yellow'}>{orderStatus}</Tag>
        }
        if (orderStatus === 'Delayed or Declined') {
            return <Tag color={'red'}>{orderStatus}</Tag>
        }
    }

    const tableColumns = [
        {
            title: 'Order ID',
            dataIndex: 'orderID',
            key: 'orderID'
        },
        {
            title: 'Food Details',
            dataIndex: 'foodDetails',
            key: 'foodDetails',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `₦${price.toFixed(2)}`,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: renderOrderStatus
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date'
        }
    ];

    const filteredOrders = orders.filter((order) =>
        order.orderID.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div>
            <Input.Search
                placeholder="Search Order ID"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '20rem', marginLeft: '45rem', marginTop: '1rem' }}
                allowClear
            />
        <Card title={"Order History"} style={{ margin: 20 }}>
            <Table
                dataSource={filteredOrders}
                columns={tableColumns}
                rowKey={"orderID"}
                onRow={(orderItem) => ({
                    onClick: () => navigate(`/orders/${orderItem.orderID}`)
                })}
            />
        </Card>
        </div>
    )
}

export default History;
