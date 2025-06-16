export interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  disconnect(): void;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

export interface BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
  name?: string;
}

export interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

export interface BluetoothRemoteGATTCharacteristic {
  writeValue(value: BufferSource): Promise<void>;
}

export interface DroneControlData {
  id: number;
  x: number;    // Вперед/назад (-1 до 1)
  y: number;    // Влево/вправо (-1 до 1)
  z: number;    // Вверх/вниз (-1 до 1)
  yaw: number;  // Поворот (-1 до 1)
  pitch: number;// Наклон вперед/назад (-1 до 1)
  roll: number; // Наклон влево/вправо (-1 до 1)
}

export interface BluetoothOptions {
  deviceNames: string[];
  UUID: {
    service: string;
    characteristic: string[];
  };
} 