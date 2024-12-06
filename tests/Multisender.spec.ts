import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address, Dictionary } from '@ton/core'; 
import { MultiSender,MultiSendTON,MultiSendToken} from '../wrappers/Multisender'; 
import '@ton/test-utils';

describe('MultiSender Contract Tests', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let multisender: SandboxContract<MultiSender>;
    let ownerAddress: Address;
    let adminAddress: Address;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');

        multisender = blockchain.openContract(await MultiSender.fromInit());

        // Fund the multisender contract
        await multisender.send(
            deployer.getSender(),
            {
                value: toNano('0.1'), 
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
    });

    it('should send TON to multiple recipients', async () => {
        
        const recipient1 = Address.parse("0QDgO_Y4qGyiexBTGcerYWrYk6xFMdoSxI3eYIb0uWWkbYez");
        const recipient2 = Address.parse("0QAeeQNwE-DRA21gwA2kS6ij7Bq-trWyoZGfcx22DPnA0L6k");

        // Prepare the message for sending TON
        const ton_user_list: Dictionary<bigint, Address> = Dictionary.empty();
        ton_user_list.set(0n, recipient1);
        ton_user_list.set(1n, recipient2);

        const ton_sending_value: Dictionary<bigint, bigint> = Dictionary.empty();
        ton_sending_value.set(0n, toNano("0.01"));
        ton_sending_value.set(1n, toNano("0.02"));

        // Create the msgTON object using the MultiSendTON type
        const msgTON: MultiSendTON = {
            $$type: 'MultiSendTON', 
            length: 2n, 
            ton_user_list: ton_user_list,
            ton_sending_value: ton_sending_value,
        };

        // Send the MultiSendTON message
        await multisender.send(
            deployer.getSender(),
            {
                value: toNano('0.03'),
            },
            msgTON
        );

    });

    it('should send tokens to multiple recipients', async () => {
        const recipient1 = Address.parse("0QDgO_Y4qGyiexBTGcerYWrYk6xFMdoSxI3eYIb0uWWkbYez");
        const recipient2 = Address.parse("0QAeeQNwE-DRA21gwA2kS6ij7Bq-trWyoZGfcx22DPnA0L6k");
    
        // Owner's token wallet address
        const senderJettonWallet = Address.parse("0QDjA6qGPrq3HcDrEe9kRfVbN7iy42JWieZDW9fMihZlSFq6");
    
        // Prepare the message for sending tokens
        const token_user_list: Dictionary<bigint, Address> = Dictionary.empty();
        token_user_list.set(0n, recipient1);
        token_user_list.set(1n, recipient2);
    
        const token_sending_value: Dictionary<bigint, bigint> = Dictionary.empty();
        token_sending_value.set(0n, toNano("0.01")); 
        token_sending_value.set(1n, toNano("0.02")); 
    
        const msgToken: MultiSendToken = {
            $$type: 'MultiSendToken', 
            length: 2n, 
            sender_jetton_wallet: senderJettonWallet,
            token_user_list: token_user_list,
            token_sending_value: token_sending_value,
        };
    
        // Send the MultiSendToken message
        await multisender.send(
            deployer.getSender(),
            {
                value: toNano('0.03'),
            },
            msgToken
        );

    });
    
});
