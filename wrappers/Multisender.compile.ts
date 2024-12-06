import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/multisender.tact',
    options: {
        debug: true,
    },
};
