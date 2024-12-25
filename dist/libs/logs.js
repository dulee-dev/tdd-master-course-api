var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
export const initLog = (port) => __awaiter(void 0, void 0, void 0, function* () {
    // Log server info
    console.log('');
    console.log('  ' + chalk.greenBright.bold('🚀 Starting Development Server...'));
    console.log('');
    console.log('  ' + `${chalk.gray('URL:')} http://localhost:${port}`);
    console.log('  ' + `${chalk.gray('API:')} http://localhost:${port}/api`);
    console.log('');
});
