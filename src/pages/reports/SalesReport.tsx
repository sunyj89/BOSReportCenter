import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  TreeSelect, 
  DatePicker, 
  Checkbox, 
  Button, 
  Table, 
  Space,
  Row,
  Col
} from 'antd';
import { DownloadOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TreeSelectProps } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;

// 模拟组织机构数据
const orgData: TreeSelectProps['treeData'] = [
  {
    title: '江西交投化石能源公司',
    value: 'HQ',
    key: 'HQ',
    children: Array.from({ length: 8 }).map((_, index) => ({
      title: `分公司${index + 1}`,
      value: `branch-${index + 1}`,
      key: `branch-${index + 1}`,
      children: Array.from({ length: 5 }).map((_, subIndex) => ({
        title: `油站${index + 1}-${subIndex + 1}`,
        value: `station-${index + 1}-${subIndex + 1}`,
        key: `station-${index + 1}-${subIndex + 1}`,
      })),
    })),
  },
];

// 定义报表字段
const reportFields = [
  { label: '日期', value: 'date' },
  { label: '组织机构', value: 'org' },
  { label: '油品品号', value: 'oilType' },
  { label: '销售数量', value: 'quantity' },
  { label: '销售金额', value: 'amount' },
  { label: '单价', value: 'price' },
  { label: '油枪号', value: 'gunNo' },
  { label: '交易笔数', value: 'transactions' },
];

// 定义表格数据类型
interface SalesData {
  key: string;
  date: string;
  org: string;
  oilType: string;
  quantity: number;
  amount: number;
  price: number;
  gunNo: string;
  transactions: number;
}

// 模拟表格数据
const generateMockData = (): SalesData[] => {
  return Array.from({ length: 100 }).map((_, index) => {
    const oilTypes = ['92#', '95#', '98#', '0#', '尿素'];
    const oilType = oilTypes[Math.floor(Math.random() * oilTypes.length)];
    const quantity = Math.floor(Math.random() * 1000) + 100;
    const price = oilType === '尿素' ? 15 : (oilType === '92#' ? 7.23 : (oilType === '95#' ? 7.78 : (oilType === '98#' ? 8.52 : 7.05)));
    const amount = +(quantity * price).toFixed(2);
    const branchIndex = Math.floor(Math.random() * 8) + 1;
    const stationIndex = Math.floor(Math.random() * 5) + 1;
    
    return {
      key: `${index}`,
      date: `2023-03-${Math.floor(Math.random() * 30) + 1}`,
      org: `分公司${branchIndex} / 油站${branchIndex}-${stationIndex}`,
      oilType,
      quantity,
      amount,
      price,
      gunNo: `${oilType === '尿素' ? '尿素' : oilType}枪${Math.floor(Math.random() * 2) + 1}`,
      transactions: Math.floor(Math.random() * 50) + 10,
    };
  });
};

const SalesReport: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedFields, setSelectedFields] = useState<string[]>(['date', 'org', 'oilType', 'quantity', 'amount', 'price']);
  const [data, setData] = useState<SalesData[]>(generateMockData());
  const [loading, setLoading] = useState<boolean>(false);

  // 处理字段选择变化
  const handleFieldsChange = (checkedValues: string[]) => {
    setSelectedFields(checkedValues);
  };

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

  // 根据选中的字段动态生成表格列
  const getColumns = (): ColumnsType<SalesData> => {
    const allColumns: ColumnsType<SalesData> = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        sorter: (a, b) => a.date.localeCompare(b.date),
      },
      {
        title: '组织机构',
        dataIndex: 'org',
        key: 'org',
      },
      {
        title: '油品品号',
        dataIndex: 'oilType',
        key: 'oilType',
        filters: [
          { text: '92#', value: '92#' },
          { text: '95#', value: '95#' },
          { text: '98#', value: '98#' },
          { text: '0#', value: '0#' },
          { text: '尿素', value: '尿素' },
        ],
        onFilter: (value, record) => record.oilType === value,
      },
      {
        title: '销售数量(升)',
        dataIndex: 'quantity',
        key: 'quantity',
        sorter: (a, b) => a.quantity - b.quantity,
      },
      {
        title: '销售金额(元)',
        dataIndex: 'amount',
        key: 'amount',
        sorter: (a, b) => a.amount - b.amount,
      },
      {
        title: '单价(元/升)',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '油枪号',
        dataIndex: 'gunNo',
        key: 'gunNo',
      },
      {
        title: '交易笔数',
        dataIndex: 'transactions',
        key: 'transactions',
        sorter: (a, b) => a.transactions - b.transactions,
      },
    ];

    return allColumns.filter(column => {
      if ('dataIndex' in column) {
        const dataIndex = column.dataIndex as string;
        return selectedFields.includes(dataIndex);
      }
      return false;
    });
  };

  return (
    <div>
      <Card title="销售报表" style={{ marginBottom: 16 }}>
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

          <Form.Item label="显示字段">
            <Checkbox.Group 
              options={reportFields} 
              value={selectedFields} 
              onChange={handleFieldsChange} 
            />
          </Form.Item>

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
          columns={getColumns()} 
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

export default SalesReport; 