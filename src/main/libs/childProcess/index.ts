import { exec } from 'child_process';
import { Result } from '@src/types/result';

export const isJSONString = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

export const execAsync = async <T = string>(
  command: string,
  args: string[],
): Promise<Result<{ stdout: T; stderr: string }, Error>> => {
  const [normalizedCommand, ...normalizedArgs] = [command, ...args].map(
    (str) => {
      let s = str;
      s = s.replace(/\//g, '\\');
      s = s.replace(/"/g, `\\"`);
      s = s.replace(/\^/g, '^^');
      s = s.replace(/\|/g, '^|');
      s = s.replace(/</g, '^<');
      s = s.replace(/>/g, '^>');
      s = s.replace(/&/g, '^&');
      s = s.replace(/;/g, '^;');
      s = s.replace(/%/g, '^%');
      s = s.replace(/!/g, '^!');
      return `${s}`;
    },
  );

  const superNormalizedArgs = normalizedArgs.map((str) => `"${str}"`);

  console.log(`${normalizedCommand} ${superNormalizedArgs.join(' ')}`);

  return new Promise((resolve) => {
    exec(
      `${normalizedCommand} ${superNormalizedArgs.join(' ')}`,
      (err, stdout, stderr) => {
        if (err) {
          console.log({
            err,
            stderr,
          });
          resolve({
            ok: false,
            error: new Error(`Exception: ${JSON.stringify({ stderr, err })}`),
          });
        } else {
          const isJSON = isJSONString(stdout);
          if (isJSON) {
            const jsonStd = JSON.parse(stdout) as T;
            resolve({ ok: true, value: { stdout: jsonStd, stderr } });
          } else {
            const std = stdout as T;
            resolve({ ok: true, value: { stdout: std, stderr } });
          }
        }
      },
    );
  });
};
