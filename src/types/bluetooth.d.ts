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