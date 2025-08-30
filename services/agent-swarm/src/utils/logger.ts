/**
 * Logger utility for Agent Swarm
 */

import * as winston from 'winston';
import * as path from 'path';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  verbose: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
  verbose: 'gray'
};

winston.addColors(logColors);

export class Logger {
  private logger: winston.Logger;
  private context: string;

  constructor(context: string) {
    this.context = context;
    
    const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    
    this.logger = winston.createLogger({
      levels: logLevels,
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { 
        service: 'agent-swarm',
        context: this.context 
      },
      transports: [
        // Console transport with colors
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, context, ...metadata }) => {
              let msg = `${timestamp} [${context}] ${level}: ${message}`;
              
              if (Object.keys(metadata).length > 0) {
                msg += ` ${JSON.stringify(metadata)}`;
              }
              
              return msg;
            })
          )
        }),
        
        // File transport for all logs
        new winston.transports.File({
          filename: path.join(logDir, 'agent-swarm.log'),
          maxsize: 10485760, // 10MB
          maxFiles: 5
        }),
        
        // Separate file for errors
        new winston.transports.File({
          filename: path.join(logDir, 'agent-swarm-error.log'),
          level: 'error',
          maxsize: 10485760,
          maxFiles: 5
        })
      ]
    });

    // Handle uncaught exceptions
    this.logger.exceptions.handle(
      new winston.transports.File({
        filename: path.join(logDir, 'agent-swarm-exceptions.log')
      })
    );
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: any): void {
    this.logger.info(message, { context: this.context, ...metadata });
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, metadata?: any): void {
    const errorData = error instanceof Error ? {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name
    } : { error };
    
    this.logger.error(message, { 
      context: this.context, 
      ...errorData,
      ...metadata 
    });
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: any): void {
    this.logger.warn(message, { context: this.context, ...metadata });
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: any): void {
    this.logger.debug(message, { context: this.context, ...metadata });
  }

  /**
   * Log verbose message
   */
  verbose(message: string, metadata?: any): void {
    this.logger.verbose(message, { context: this.context, ...metadata });
  }

  /**
   * Log agent metrics
   */
  logMetrics(agentId: string, metrics: any): void {
    this.info('Agent Metrics', {
      agentId,
      metrics,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log swarm progress
   */
  logProgress(progress: {
    collected: number;
    enriched: number;
    validated: number;
    target: number;
    percentage: number;
  }): void {
    const emoji = progress.percentage >= 100 ? '🎉' : 
                  progress.percentage >= 75 ? '🚀' :
                  progress.percentage >= 50 ? '⚡' :
                  progress.percentage >= 25 ? '🔥' : '🐝';
    
    this.info(`${emoji} Swarm Progress: ${progress.percentage.toFixed(2)}%`, {
      ...progress,
      remaining: progress.target - progress.validated
    });
  }

  /**
   * Create child logger with additional context
   */
  child(additionalContext: string): Logger {
    return new Logger(`${this.context}:${additionalContext}`);
  }
}

export default Logger;