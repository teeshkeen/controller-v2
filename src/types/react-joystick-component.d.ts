declare module 'react-joystick-component' {
  import { Component } from 'react';

  interface JoystickProps {
    size?: number;
    baseColor?: string;
    stickColor?: string;
    move?: (event: { type: 'move' | 'stop'; x: number; y: number }) => void;
    stop?: (event: { type: 'move' | 'stop'; x: number; y: number }) => void;
  }

  const Joystick: React.FC<JoystickProps>;
  export default Joystick;
} 