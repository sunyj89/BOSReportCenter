import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  TeamOutlined, 
  CarOutlined 
} from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h2>欢迎使用BOS报表中心</h2>
      <p>江西交投化石能源公司综合数据分析平台</p>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日销售额"
              value={128960}
              precision={2}
              valueStyle={{ color: '#32AF50' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="今日销售量"
              value={15280}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ShoppingCartOutlined />}
              suffix="升"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="车辆数"
              value={1893}
              valueStyle={{ color: '#0066cc' }}
              prefix={<CarOutlined />}
              suffix="辆"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="员工数"
              value={245}
              valueStyle={{ color: '#cf1322' }}
              prefix={<TeamOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="系统公告">
            <p>1. 新版报表中心已上线，请各单位及时使用新系统。</p>
            <p>2. 各油站销售数据请于每日营业结束后及时上传。</p>
            <p>3. 系统将于本周日凌晨2:00-4:00进行例行维护，请提前做好工作安排。</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 