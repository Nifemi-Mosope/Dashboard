import { Card, Descriptions, Divider, List, Button } from "antd";
import { useParams, useLocation } from "react-router-dom";

function Orders() {
    const { orderId } = useParams();
    const location = useLocation();
    const orderItem = location.state;

    const dishes = [
        {
            "dish": "Jollof Rice",
            "scoops": 2,
            "price": 2500
        },
        {
            "dish": "Fried Rice",
            "scoops": 1,
            "price": 1800
        },
        {
            "dish": "Pounded Yam and Egusi Soup",
            "scoops": 1,
            "price": 2200
        },
        {
            "dish": "Suya",
            "scoops": 10,
            "price": 3000
        }
    ]

    const cardStyle = {
        margin: 20,
        width: '150%',
        marginLeft: '40%',
        height: '780px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        alignItems: 'center',
    };

    const descriptionStyle = {
        whiteSpace: 'pre-wrap',
        maxWidth: "300px"
    };

    return (
        <Card title={`Order ${orderId}`} style={cardStyle}>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">{orderId}</Descriptions.Item>
                <Descriptions.Item label="Customer">
                    {orderItem?.customer || 'N/A'} {/* Use optional chaining */}
                </Descriptions.Item>
                <Descriptions.Item label="Customer Description" style={descriptionStyle}>
                    {orderItem?.description || 'NIL'} {/* Use optional chaining */}
                </Descriptions.Item>
            </Descriptions>
            <Divider />
            <List
                dataSource={dishes}
                renderItem={(dishItem) => (
                    <List.Item>
                        <div style={{ fontWeight: 'bold' }}>{dishItem.dish} x{dishItem.scoops}</div>
                        <div>₦{dishItem.price}</div>
                    </List.Item>
                )}
            />
            <Divider />
            <div style={styles.totalSum}>
                <h2>Total:</h2>
                <h2 style={styles.totalPrice}>₦1000</h2>
            </div>
            <Divider />
            <div style={styles.buttonContainer}>
                <Button block type="danger" size="large" style={styles.button}>
                    Delay or Decline Order
                </Button>
                <Button block type="primary" size="large" style={styles.button}>
                    Accept Order
                </Button>
            </div>
            <Button block type="primary" size="large">
                Food has been Packaged and now Ready for PickUp
            </Button>
        </Card>
    );
}

const styles = {
    totalSum: {
        flexDirection: 'row',
        display: 'flex',
    },
    totalPrice: {
        marginLeft: 'auto',
        fontWeight: 'bold'
    },
    buttonContainer: {
        display: 'flex',
        paddingBottom: 30
    },
    button: {
        marginRight: 20,
        marginLeft: 20
    }
}

export default Orders;
