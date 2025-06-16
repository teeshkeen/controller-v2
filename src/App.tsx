import React from 'react';
import { DroneController } from './components/DroneController';
import './App.css';

export const App: React.FC = () => {
  return (
    <div className="app">
      <DroneController />
    </div>
  );
}; 