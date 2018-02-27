export interface LogMessage {
  message: string;
  level: 'DEBUG' | 'WARN' | 'INFO' | 'ERROR' | 'FATAL'
}