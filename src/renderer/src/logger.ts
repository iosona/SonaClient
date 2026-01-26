interface Styles {
    debug: string;
    info: string
    success: string;
    warn: string;
    error: string;
    time: string
}

interface Logger {
    styles: Styles
    _print: (type: keyof Styles, message: string, data: any) => void;
    debug: (msg: string, data?: any) => void;
    info: (msg: string, data?: any) => void;
    success: (msg: string, data?: any) => void;
    warn: (msg: string, data?: any) => void;
    error: (msg: string, data?: any) => void;
}

export const logger: Logger = {
  styles: {
    debug: "background: #7f8c8d; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
    info: "background: #2980b9; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
    success: "background: #27ae60; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
    warn: "background: #f39c12; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
    error: "background: #c0392b; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;",
    time: "color: #7f8c8d; font-size: 10px;"
  },

  _print(type, message, data) {
    const time = new Date().toLocaleTimeString();
    const label = type.toUpperCase();
    
    console.groupCollapsed(
      `%c${time}%c %c${label}%c ${message}`,
      this.styles.time,
      "",
      this.styles[type],
      "",
    );
    
    if (data) {
      console.log("Payload:", data);
    }
    
    if (type === 'error' || type === 'warn') {
      console.trace("Stack Trace:");
    }
    
    console.groupEnd();
  },

  debug(msg, data = null) { this._print('debug', msg, data); },
  info(msg, data = null) { this._print('info', msg, data); },
  success(msg, data = null) { this._print('success', msg, data); },
  warn(msg, data = null) { this._print('warn', msg, data); },
  error(msg, data = null) { this._print('error', msg, data); }
};