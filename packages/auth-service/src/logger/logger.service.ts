// Native.
import { randomUUID } from "crypto";

// Package.
import debug, { IDebugger } from "debug";
import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  Scope,
  LoggerService,
} from "@nestjs/common";

// Code.
export const NAMESPACE = "qapi";
export const LOG_LEVELS = ["debug", "silly", "verbose", "log", "error", "warn"];

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends ConsoleLogger implements LoggerService {
  public id: string;
  public name: string;
  public printers: { [key: string]: IDebugger };

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    const name = context || randomUUID().substr(0, 8);
    if (options) {
      super(name, options);
    } else {
      super(name);
    }

    this.name = name;
    this.id = `${NAMESPACE}:${name}`.toLowerCase();
    this.printers = {};

    for (const level of LOG_LEVELS) {
      const printerRef = this.getPrinterRef(level);
      this.printers[printerRef] = debug(printerRef);
    }
  }

  debug(message: any, ...args: any[]) {
    const print = this.getPrinter("debug");
    print(message, ...args);
  }

  silly(message: any, ...args: any[]) {
    const print = this.getPrinter("silly");
    print(message, ...args);
  }

  verbose(message: any, ...args: any[]) {
    const print = this.getPrinter("verbose");
    print(message, ...args);
  }

  log(message: any, ...args: any[]) {
    const print = this.getPrinter("log");
    print(message, ...args);
  }

  error(message: any, ...args: any[]) {
    const print = this.getPrinter("error");
    print(message, ...args);
  }

  warn(message: any, ...args: any[]) {
    const print = this.getPrinter("warn");
    print(message, ...args);
  }

  getPrinter(level: string) {
    return this.printers[this.getPrinterRef(level)];
  }

  getPrinterRef(level: string) {
    if (!LOG_LEVELS.includes(level)) {
      return `${NAMESPACE}:debug:${this.name}`.toLowerCase();
    }

    return `${NAMESPACE}:${level}:${this.name}`.toLowerCase();
  }
}
