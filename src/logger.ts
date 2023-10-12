import pinoLogger from 'pino';
import pinoPretty from 'pino-pretty';

const stream = pinoPretty({
    colorize: true
});

const logger = pinoLogger({
    level: 'debug',
},  stream);

export default logger;