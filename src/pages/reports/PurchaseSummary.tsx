import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  TreeSelect, 
  DatePicker, 
  Button, 
  Table, 
  Space,
  Row,
  Col
} from 'antd';
import { DownloadOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { orgData, branchNames, suppliers, oilTypes, getRandomStationName } from '../../utils/orgData';

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

// 定义表格数据类型
interface PurchaseData {
  key: string;
  id: string;
  oilName: string;
  stationName: string;
  quantity: number;
  cost: number;
  supplier: string;
  purchaseTime: string;
}

// 模拟表格数据
const generateMockData = (): PurchaseData[] => {
  return Array.from({ length: 20 }).map((_, index) => {
    const oilName = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const quantity = +(Math.random() * 30 + 5).toFixed(2);
    const unitPrice = oilName === '尿素' ? 2000 : 
                     (oilName === '92#汽油' ? 7500 : 
                     (oilName === '95#汽油' ? 8000 : 
                     (oilName === '98#汽油' ? 8500 : 7000)));
    const cost = +(quantity * unitPrice).toFixed(2);
    
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const year = 2023;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    
    return {
      key: `${index}`,
      id: `PO${String(10000 + index).padStart(5, '0')}`,
      oilName,
      stationName: getRandomStationName(),
      quantity,
      cost,
      supplier,
      purchaseTime: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
    };
  });
};

const PurchaseSummary: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PurchaseData[]>(generateMockData());
  const [loading, setLoading] = useState<boolean>(false);

  // 处理表单提交
  const handleSubmit = () => {
    setLoading(true);
    // 模拟API请求
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 500);
  };

  // 处理表单重置
  const handleReset = () => {
    form.resetFields();
  };

  // 处理导出Excel
  const handleExport = () => {
    // 实际项目中这里应该调用导出API
    alert('导出Excel功能将在实际项目中实现');
  };

  // 表格列定义
  const columns: ColumnsType<PurchaseData> = [
    {
      title: '进货单ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      width: 100,
      filters: oilTypes.map(type => ({ text: type, value: type })),
      onFilter: (value, record) => record.oilName === value,
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      width: 200,
    },
    {
      title: '进油量(吨)',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: '进油成本(元)',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      sorter: (a, b) => a.cost - b.cost,
      render: (text) => text.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' }),
    },
    {
      title: '供应商',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 120,
      filters: suppliers.map(supplier => ({ text: supplier, value: supplier })),
      onFilter: (value, record) => record.supplier === value,
    },
    {
      title: '进油时间',
      dataIndex: 'purchaseTime',
      key: 'purchaseTime',
      width: 180,
      sorter: (a, b) => a.purchaseTime.localeCompare(b.purchaseTime),
    },
  ];

  return (
    <div>
      <Card title="加油站进货明细表" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="组织机构"
                name="organizations"
                rules={[{ required: true, message: '请选择组织机构' }]}
              >
                <TreeSelect
                  treeData={orgData}
                  treeCheckable={true}
                  showCheckedStrategy={SHOW_PARENT}
                  placeholder="请选择组织机构"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="时间范围"
                name="dateRange"
                rules={[{ required: true, message: '请选择时间范围' }]}
              >
                <RangePicker 
                  style={{ width: '100%' }} 
                  showTime 
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                查询
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
              <Button 
                type="primary" 
                onClick={handleExport} 
                icon={<DownloadOutlined />}
              >
                导出Excel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card>
        <Table 
          columns={columns} 
          dataSource={data} 
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default PurchaseSummary; 