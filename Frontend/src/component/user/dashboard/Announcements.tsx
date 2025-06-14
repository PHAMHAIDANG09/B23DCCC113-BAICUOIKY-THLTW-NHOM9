import React, { useState, useEffect } from 'react';
import { Card, Typography, Divider, Space, Spin, Empty, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

interface Notification {
  _id: string;
  title: string;
  createdAt: string;
}

const MAX_NOTIFICATIONS = 6; // Định nghĩa số lượng thông báo tối đa

const Announcements: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://btck-123.onrender.com/api/notifications');
        if (response.data && response.data.data) {
          // Sort by date and take latest 6
          const sortedNotifications = response.data.data
            .sort((a: Notification, b: Notification) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .slice(0, MAX_NOTIFICATIONS);
          setNotifications(sortedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        message.error('Không thể tải thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNewsClick = (id: string) => {
    navigate(`/thong-bao/${id}`);
  };

  return (
    <Card
      title={
        <Space>
          <BellOutlined style={{ color: '#1890ff' }} />
          <span>Thông báo mới</span>
        </Space>
      }
      style={{
        borderRadius: 12,
        height: '100%',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}
      headStyle={{
        borderBottom: '1px solid #f0f0f0',
        fontSize: 16,
        fontWeight: 500
      }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin />
        </div>
      ) : notifications.length === 0 ? (
        <Empty description="Chưa có thông báo nào" />
      ) : (
        notifications.map(notification => (
          <div key={notification._id} style={{ marginBottom: 16 }} onClick={() => handleNewsClick(notification._id)}>
            <Paragraph
              ellipsis={{ rows: 1 }}
              style={{
                fontWeight: 500,
                marginBottom: 4,
                cursor: 'pointer',
                fontSize: 15
              }}
            >
              {notification.title}
            </Paragraph>
            <Text type="secondary" style={{ fontSize: 13 }}>
              {format(new Date(notification.createdAt), 'dd/MM/yyyy')}
            </Text>
            <Divider style={{ margin: '12px 0' }} />
          </div>
        ))
      )}
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <a href="/thong-bao" style={{ color: '#1890ff', fontSize: 14, fontWeight: 500 }}>
          Xem tất cả thông báo
        </a>
      </div>
    </Card>
  );
};

export default Announcements;
