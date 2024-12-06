

import { toNano, Address, beginCell } from '@ton/core';
import { MultiSender } from '';
import { NetworkProvider, Sender } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Define the MultiSender contract address
    const multisenderAddress = Address.parse('EQBe8uLpOW_DNJx_ZO1JUG8JTpXn_jrxOnU0tTJZtrOhnRls'); 

    // Open the deployed MultiSender contract
    const multisender = provider.open(MultiSender.createFromAddress(multisenderAddress));

    // Define the recipients and their amounts in nanoTONs
    const recipients = new Map<Address, bigint>([
        [Address.parse('0:address1'), toNano('0.01')], // 0.01 TON to address1
        [Address.parse('0:address2'), toNano('0.02')], // 0.02 TON to address2
        [Address.parse('0:address3'), toNano('0.03')]  // 0.03 TON to address3
    ]);

    // Create the body for the transfer message
    const transferMessage = beginCell()
        .storeUint(0x12345678, 32) // Some identifier (if needed)
        .storeMap(recipients, (address, amount) => {
            address.writeToCell();
            amount.writeToCell();
        })
        .endCell();

    // Send TON to multiple users using MultiSender contract
    await multisender.send(
        provider.sender(), // Use the sender (TON Keeper)
        {
            value: toNano('0.06'), // Total value to send (sum of amounts)
        },
        {
            $$type: 'Transfer',
            amountsMap: recipients, // Provide the map of recipients and amounts
        }
    );

    console.log(`Transfer to multiple users initiated.`);
}
