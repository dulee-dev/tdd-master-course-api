import chalk from 'chalk';

export const initLog = async (port: number) => {
  // Log server info
  console.log('');
  console.log(
    '  ' + chalk.greenBright.bold('🚀 Starting Development Server...')
  );
  console.log('');
  console.log('  ' + `${chalk.gray('URL:')} http://localhost:${port}`);
  console.log('  ' + `${chalk.gray('API:')} http://localhost:${port}/api`);
  console.log('');
};
