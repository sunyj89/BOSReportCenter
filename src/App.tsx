import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import './assets/styles/App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#32AF50',
        },
      }}
    >
      <Routes>
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App; 