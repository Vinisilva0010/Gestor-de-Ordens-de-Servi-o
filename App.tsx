
import React, { useState } from 'react';
import { ServiceOrder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { ServiceOrderList } from './components/ServiceOrderList';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { ServiceOrderDetail } from './components/ServiceOrderDetail';

type View = 'HOME' | 'LIST' | 'FORM' | 'DETAIL';

const App = () => {
  const [orders, setOrders] = useLocalStorage<ServiceOrder[]>('zanvexis-service-orders', []);
  const [currentView, setCurrentView] = useState<View>(orders.length > 0 ? 'LIST' : 'HOME');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleCreateOrder = () => {
    setCurrentView('FORM');
  };

  const handleSaveOrder = (newOrder: ServiceOrder) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCurrentView('LIST');
  };

  const handleUpdateOrder = (updatedOrder: ServiceOrder) => {
    setOrders(prevOrders => prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };
  
  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setCurrentView('DETAIL');
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    setCurrentView('LIST');
  };
  
  const handleCancelForm = () => {
      setCurrentView(orders.length > 0 ? 'LIST' : 'HOME');
  }

  const renderContent = () => {
    switch (currentView) {
      // Fix: Correctly navigate to the form view when creating an order from the home page.
      case 'HOME':
        return <HomePage onCreateOrder={handleCreateOrder} />;
      case 'LIST':
        return <ServiceOrderList orders={orders} onSelectOrder={handleSelectOrder} onCreateOrder={handleCreateOrder} />;
      case 'FORM':
        return <ServiceOrderForm onSave={handleSaveOrder} onCancel={handleCancelForm} />;
      case 'DETAIL':
        const selectedOrder = orders.find(o => o.id === selectedOrderId);
        if (selectedOrder) {
          return <ServiceOrderDetail order={selectedOrder} onUpdateOrder={handleUpdateOrder} onBack={handleBackToList} />;
        }
        // Fallback if order not found
        setCurrentView('LIST');
        return null;
      // Fix: Correctly navigate to the form view for the default case.
      default:
        return <HomePage onCreateOrder={handleCreateOrder} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;