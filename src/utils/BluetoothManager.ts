import { BluetoothOptions, DroneControlData } from '../types/bluetooth';
import type { BluetoothRemoteGATTServer, BluetoothDevice } from '../types/bluetooth';

export class BluetoothManager {
  private server: BluetoothRemoteGATTServer | null = null;
  private device: BluetoothDevice | null = null;
  private isConnected = false;

  constructor(private options: BluetoothOptions) {}

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Уже подключено');
      return;
    }

    try {
      this.device = await (window as any).navigator.bluetooth.requestDevice({
        filters: this.options.deviceNames.map((name) => ({ namePrefix: name })),
        optionalServices: [this.options.UUID.service],
      });

      if (!this.device || !this.device.gatt) {
        throw new Error('GATT сервер недоступен');
      }

      this.server = await this.device.gatt.connect();
      this.isConnected = true;
      console.log('Подключено к устройству:', this.device.name);
    } catch (error) {
      console.error('Ошибка подключения:', error);
      this.disconnect();
      throw error;
    }
  }

  public async sendControlData(data: DroneControlData): Promise<void> {
    if (!this.isConnected || !this.server) {
      throw new Error('Нет подключения');
    }

    try {
      const service = await this.server.getPrimaryService(this.options.UUID.service);
      const characteristic = await service.getCharacteristic(this.options.UUID.characteristic[1]);
      
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(JSON.stringify(data));
      await characteristic.writeValue(encodedData);
      
      console.log('Данные отправлены:', data);
    } catch (error) {
      console.error('Ошибка отправки данных:', error);
      throw error;
    }
  }

  public disconnect(): void {
    if (this.server && this.isConnected) {
      this.server.disconnect();
    }
    this.server = null;
    this.device = null;
    this.isConnected = false;
    console.log('Отключено');
  }

  public isDeviceConnected(): boolean {
    return this.isConnected;
  }
} 