import React, { useState, useEffect } from 'react';
import { Layout, Menu, Tabs, Button, Dropdown } from 'antd';
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BarChartOutlined,
  TableOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import type { MenuProps } from 'antd';
import DashboardPage from '../pages/Dashboard';
import SalesReportPage from '../pages/reports/SalesReport';
import InventoryReportPage from '../pages/reports/InventoryReport';
import PurchaseSummaryPage from '../pages/reports/PurchaseSummary';
import OilInventoryReportPage from '../pages/reports/OilInventoryReport';
import StationSalesDetailReportPage from '../pages/reports/StationSalesDetailReport';
import StationControlFlowReportPage from '../pages/reports/StationControlFlowReport';
import GoodsTransferReportPage from '../pages/reports/GoodsTransferReport';
import GoodsInventoryReportPage from '../pages/reports/GoodsInventoryReport';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

// 定义菜单项类型
interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path: string;
}

// 定义标签页类型
interface TabItem {
  key: string;
  label: string;
  path: string;
  closable: boolean;
}

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: 'dashboard', label: '首页', path: '/dashboard', closable: false }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置
  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      label: '首页',
      icon: <DashboardOutlined />,
      path: '/',
    },
    {
      key: 'sales-report',
      label: '销售报表',
      icon: <BarChartOutlined />,
      path: '',
      children: [
        {
          key: 'sales-analysis',
          label: '销售分析',
          path: '/reports/sales',
        },
        {
          key: 'inventory-analysis',
          label: '库存分析',
          path: '/reports/inventory',
        },
        {
          key: 'purchase-summary',
          label: '加油站进货明细表',
          path: '/reports/purchase-summary',
        },
        {
          key: 'oil-inventory',
          label: '油品进销存报表',
          path: '/reports/oil-inventory',
        },
        {
          key: 'goods-inventory',
          label: '商品进销存报表',
          path: '/reports/goods-inventory',
        },
        {
          key: 'station-sales-detail',
          label: '油站销售明细表',
          path: '/reports/station-sales-detail',
        },
        {
          key: 'station-control-flow',
          label: '油站管控流水',
          path: '/reports/station-control-flow',
        },
      ],
    },
    {
      key: 'inventory-report',
      label: '库存报表',
      icon: <TableOutlined />,
      path: '',
      children: [
        {
          key: 'goods-transfer',
          label: '商品调拨入库表',
          path: '/reports/goods-transfer',
        },
      ],
    },
    {
      key: 'loss-profit-report',
      label: '损溢报表',
      icon: <TableOutlined />,
      path: '',
      children: [],
    },
    {
      key: 'purchase-report',
      label: '采购报表',
      icon: <TableOutlined />,
      path: '',
      children: [],
    },
    {
      key: 'distribution-report',
      label: '配送报表',
      icon: <TableOutlined />,
      path: '',
      children: [],
    },
    {
      key: 'performance-report',
      label: '任务绩效报表',
      icon: <TableOutlined />,
      path: '',
      children: [],
    },
    {
      key: 'settings',
      label: '系统设置',
      icon: <SettingOutlined />,
      path: '/settings'
    }
  ];

  // 将菜单项转换为Ant Design菜单格式
  const getAntdMenuItems = (items: MenuItem[]): MenuProps['items'] => {
    return items.map(item => {
      if (item.children) {
        return {
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: getAntdMenuItems(item.children)
        };
      }
      return {
        key: item.key,
        icon: item.icon,
        label: item.label
      };
    });
  };

  // 处理菜单点击事件
  const handleMenuClick = ({ key }: { key: string }) => {
    const findMenuItem = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findMenuItem(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const menuItem = findMenuItem(menuItems);
    if (!menuItem || !menuItem.path) return;

    // 检查标签页是否已存在
    const tabExists = tabs.find(tab => tab.key === key);
    if (!tabExists) {
      setTabs([...tabs, { 
        key, 
        label: menuItem.label, 
        path: menuItem.path,
        closable: key !== 'dashboard'
      }]);
    }
    
    setActiveTab(key);
    navigate(menuItem.path);
  };

  // 处理标签页切换
  const handleTabChange = (activeKey: string) => {
    setActiveTab(activeKey);
    const tab = tabs.find(tab => tab.key === activeKey);
    if (tab) {
      navigate(tab.path);
    }
  };

  // 处理标签页关闭
  const handleTabEdit = (
    targetKey: React.MouseEvent<Element> | React.KeyboardEvent<Element> | string, 
    action: 'add' | 'remove'
  ) => {
    if (action === 'remove' && typeof targetKey === 'string') {
      const newTabs = tabs.filter(tab => tab.key !== targetKey);
      setTabs(newTabs);
      
      // 如果关闭的是当前活动标签页，则切换到最后一个标签页
      if (targetKey === activeTab) {
        const lastTab = newTabs[newTabs.length - 1];
        setActiveTab(lastTab.key);
        navigate(lastTab.path);
      }
    }
  };

  // 关闭所有标签页（除了首页）
  const closeAllTabs = () => {
    const dashboardTab = tabs.find(tab => tab.key === 'dashboard');
    if (dashboardTab) {
      setTabs([dashboardTab]);
      setActiveTab('dashboard');
      navigate('/dashboard');
    }
  };

  // 用户菜单项
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人信息',
      icon: <UserOutlined />
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />
    }
  ];

  // 根据当前路径更新活动标签页
  useEffect(() => {
    const path = location.pathname;
    const findMenuItemByPath = (items: MenuItem[]): MenuItem | undefined => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findMenuItemByPath(item.children);
          if (found) return found;
        }
      }
      return undefined;
    };

    const menuItem = findMenuItemByPath(menuItems);
    if (menuItem) {
      const tabExists = tabs.find(tab => tab.key === menuItem.key);
      if (!tabExists) {
        setTabs([...tabs, { 
          key: menuItem.key, 
          label: menuItem.label, 
          path: menuItem.path,
          closable: menuItem.key !== 'dashboard'
        }]);
      }
      setActiveTab(menuItem.key);
    }
  }, [location.pathname, menuItems, tabs]);

  return (
    <Layout className="app-container">
      <Header className="app-header">
        <div className="app-logo">BOS报表中心</div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text" style={{ color: 'white' }}>
            <UserOutlined /> 管理员
          </Button>
        </Dropdown>
      </Header>
      <Layout className="app-content">
        <Sider 
          width={200} 
          collapsible 
          collapsed={collapsed} 
          trigger={null}
          className="app-sider"
        >
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <Button 
              type="text" 
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
              onClick={() => setCollapsed(!collapsed)}
              style={{ color: '#32AF50' }}
            />
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeTab]}
            style={{ height: '100%', borderRight: 0 }}
            items={getAntdMenuItems(menuItems)}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout className="app-main">
          <div className="tab-container">
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="editable-card"
              onEdit={handleTabEdit}
              className="custom-tabs"
              tabBarExtraContent={
                <Button size="small" onClick={closeAllTabs} style={{ margin: '0 8px' }}>
                  关闭所有
                </Button>
              }
            >
              {tabs.map(tab => (
                <TabPane 
                  key={tab.key} 
                  tab={tab.label} 
                  closable={tab.closable}
                />
              ))}
            </Tabs>
          </div>
          <Content className="content-container">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/reports/sales" element={<SalesReportPage />} />
              <Route path="/reports/inventory" element={<InventoryReportPage />} />
              <Route path="/reports/purchase-summary" element={<PurchaseSummaryPage />} />
              <Route path="/reports/oil-inventory" element={<OilInventoryReportPage />} />
              <Route path="/reports/station-sales-detail" element={<StationSalesDetailReportPage />} />
              <Route path="/reports/station-control-flow" element={<StationControlFlowReportPage />} />
              <Route path="/reports/goods-transfer" element={<GoodsTransferReportPage />} />
              <Route path="/reports/goods-inventory" element={<GoodsInventoryReportPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 