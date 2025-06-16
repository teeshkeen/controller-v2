import React, { useState, useCallback } from 'react';
import { BluetoothManager } from '../utils/BluetoothManager';
import { DroneControlData } from '../types/bluetooth';
import { Joystick } from './Joystick';

const BLUETOOTH_OPTIONS = {
  deviceNames: ['ESP32MPU'],
  UUID: {
    service: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
    characteristic: [
      'beb5483e-36e1-4688-b7f5-ea07361b26a8',
      'beb5483f-36e1-4688-b7f5-ea07361b26a8',
    ],
  },
};

export const DroneController: React.FC = () => {
  const [bluetoothManager] = useState(() => new BluetoothManager(BLUETOOTH_OPTIONS));
  const [isConnected, setIsConnected] = useState(false);
  const [controlData, setControlData] = useState<DroneControlData>({
    id: 1,
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    roll: 0,
  });

  const handleConnect = async () => {
    try {
      await bluetoothManager.connect();
      setIsConnected(true);
    } catch (error) {
      console.error('Ошибка подключения:', error);
    }
  };

  const handleDisconnect = () => {
    bluetoothManager.disconnect();
    setIsConnected(false);
  };

  const handleControlChange = useCallback(async (newData: Partial<DroneControlData>) => {
    const updatedData = { ...controlData, ...newData };
    setControlData(updatedData);
    
    if (isConnected) {
      try {
        await bluetoothManager.sendControlData(updatedData);
      } catch (error) {
        console.error('Ошибка отправки данных:', error);
      }
    }
  }, [controlData, isConnected, bluetoothManager]);

  const handleLeftStickMove = (event: any) => {
    if (event.type === 'move') {
      handleControlChange({
        y: event.x,
        z: -event.y
      });
    } else if (event.type === 'stop') {
      handleControlChange({
        y: 0,
        z: 0
      });
    }
  };

  const handleRightStickMove = (event: any) => {
    if (event.type === 'move') {
      handleControlChange({
        x: event.y,
        yaw: event.x
      });
    } else if (event.type === 'stop') {
      handleControlChange({
        x: 0,
        yaw: 0
      });
    }
  };

  return (
    <div className="drone-controller">
      <div className="controller-header">
        <h1>FPV Дрон Контроллер</h1>
        <div className="connection-controls">
          {!isConnected ? (
            <button onClick={handleConnect}>Подключиться</button>
          ) : (
            <button onClick={handleDisconnect}>Отключиться</button>
          )}
        </div>
        <div className="status">
          Статус: {isConnected ? 'Подключено' : 'Отключено'}
        </div>
      </div>

      <div className="joysticks-container">
        <div className="joystick-wrapper">
          <h3>Левый стик</h3>
          <p>Влево/Вправо, Вверх/Вниз</p>
          <Joystick
            size={150}
            baseColor="#666"
            stickColor="#333"
            move={handleLeftStickMove}
            stop={handleLeftStickMove}
          />
        </div>

        <div className="joystick-wrapper">
          <h3>Правый стик</h3>
          <p>Вперед/Назад, Поворот</p>
          <Joystick
            size={150}
            baseColor="#666"
            stickColor="#333"
            move={handleRightStickMove}
            stop={handleRightStickMove}
          />
        </div>
      </div>

      <div className="current-values">
        <h2>Текущие значения:</h2>
        <pre>{JSON.stringify(controlData, null, 2)}</pre>
      </div>
    </div>
  );
}; 