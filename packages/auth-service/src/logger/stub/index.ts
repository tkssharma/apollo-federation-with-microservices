// Internal.
import { Logger } from "../logger.service";

// Code.
interface StubParams {
  level: string;
  resource: string;
  message: string;
}

export const stub = ({ resource, level, message }: StubParams) => {
  const logger = new Logger(resource);
  let output = "";

  const ref = process.stderr.write.bind(process.stderr);
  // @ts-ignore
  process.stderr.write = (chunk, encoding, callback) => {
    output += chunk;
    return ref(chunk, encoding, callback);
  };

  const print = logger.getPrinter(level);
  print(message);

  process.stderr.write = ref;

  return output;
};
