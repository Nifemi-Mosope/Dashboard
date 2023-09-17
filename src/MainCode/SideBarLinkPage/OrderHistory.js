import { Card, Table, Tag } from "antd";
import orders from './orders.json';
import { useNavigate } from 'react-router-dom';

function History() {
    const navigate = useNavigate();
    
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
    const tableColums =[
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
    ]
    return(
        <Card title={"Order History"} style={{ margin: 20 }}>
            <Table
                dataSource={orders}
                columns={tableColums}
                rowKey={"orderID"}
                onRow={(orderItem) => ({
                    onClick: () => navigate(`/orders/${orderItem.orderID}`)
                })}
            />
        </Card>
    )
}
export default History;