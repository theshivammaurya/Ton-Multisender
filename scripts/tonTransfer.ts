// import { NetworkProvider } from '@ton/blueprint';
// import { MultiSender, MultiSendTON, MultiSendToken } from '../wrappers/Multisender'; 
// import { Address, toNano, Dictionary } from '@ton/core';
// import TonWeb from 'tonweb';

// export async function run(provider: NetworkProvider) {
//     const contractAddress = "EQAPpW_QMRcEc_KwpUj_LpqjqobOSwjc_OaIgtXUJlFG7Wjz"; 


//     // const tonweb = new TonWeb();
//     // const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, { address: 'kQAs9j5BPMf376bDw7M7DczRByAR6KC409dEZ1gRyHzlf5Ep' });
//     // const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(new TonWeb.utils.Address('0QDjA6qGPrq3HcDrEe9kRfVbN7iy42JWieZDW9fMihZlSFq6'));

//     // Open the MultiSender contract
//     const contract = provider.open(MultiSender.fromAddress(Address.parse(contractAddress)));

//     // // Prepare the data for MultiSendTON (sending TON)
//     // const tonRecipients = [
//     //     { address: "0QDgO_Y4qGyiexBTGcerYWrYk6xFMdoSxI3eYIb0uWWkbYez", amount: 0.05 },
//     //     { address: "0QB_GJN-uJ85M3WMbKL-Rk25q3aCECgYAedRefgVTD4Lblil", amount: 0.03 },
//     // ];

//     // Prepare the data for MultiSendToken (sending Jettons)
//     const tokenRecipients = [
//        // { address: "0QDgO_Y4qGyiexBTGcerYWrYk6xFMdoSxI3eYIb0uWWkbYez", amount: 200 },
//         { address: "0QB_GJN-uJ85M3WMbKL-Rk25q3aCECgYAedRefgVTD4Lblil", amount: 1 },
//     ];

//     // // Create Dictionaries for TON user list and values
//     // const tonUserList = Dictionary.empty<bigint, Address>();
//     // const tonSendingValue = Dictionary.empty<bigint, bigint>();
//     // tonRecipients.forEach((recipient, index) => {
//     //     tonUserList.set(BigInt(index), Address.parse(recipient.address));
//     //     tonSendingValue.set(BigInt(index), toNano(recipient.amount));
//     // });

//     // Create Dictionaries for Token user list and values
//     const tokenUserList = Dictionary.empty<bigint, Address>();
//     const tokenSendingValue = Dictionary.empty<bigint, bigint>();
//     tokenRecipients.forEach((recipient, index) => {
//         tokenUserList.set(BigInt(index), Address.parse(recipient.address));
//         tokenSendingValue.set(BigInt(index), BigInt(recipient.amount));
//     });

//     // Prepare MultiSendTON message (for sending TON)
//     // const multiSendTONMessage: MultiSendTON = {
//     //     $$type:"MultiSendTON",
//     //     length: BigInt(tonRecipients.length),
//     //     ton_user_list: tonUserList,
//     //     ton_sending_value: tonSendingValue,
//     // };

//     // Prepare MultiSendToken message (for sending Jettons)
//     const multiSendTokenMessage: MultiSendToken = {
//         $$type:"MultiSendToken",
//         length: BigInt(tokenRecipients.length),
//         sender_jetton_wallet: Address.parse("kQATH4K_ThPXOXdouhPh4gjCmbEzn0gL7ch7vEo9Jua1Mh0N"),  // Jetton wallet address
//         token_user_list: tokenUserList,
//         token_sending_value: tokenSendingValue,
//     };

//     try {
//         // Send MultiSendTON message to the contract (for sending TON)
//         // await contract.send(
//         //     provider.sender(),
//         //     { value: toNano('0.09') },  // Total amount to be sent (including additional storage or gas)
//         //     multiSendTONMessage
//         // );

//         // Send MultiSendToken message to the contract (for sending Jettons)
//         await contract.send(
//             provider.sender(),
//             { value: toNano('0.08') },  // This is the value for the token transfer message
//             multiSendTokenMessage
//         );

//         console.log('TON and Jettons sent to multiple users successfully!');
//     } catch (error: any) {
//         // Log the full error for better diagnostics
//         console.error('Failed to send TON and Jettons to multiple users:', error.message);
//         if (error.details) {
//             console.error('Error Details:', error.details);
//         }
//     }
// }


import { NetworkProvider } from '@ton/blueprint';
import { MultiSender, MultiSendTON, MultiSendToken } from '../wrappers/Multisender'; 
import { Address, toNano, Dictionary } from '@ton/core';

export async function run(provider: NetworkProvider) {
    const contractAddressHex = "EQAPpW_QMRcEc_KwpUj_LpqjqobOSwjc_OaIgtXUJlFG7Wjz"; 
    const contract = provider.open(MultiSender.fromAddress(Address.parse(contractAddressHex)));

    // Prepare data for Jetton transfers
    const jettonWalletHex = "EQATH4K_ThPXOXdouhPh4gjCmbEzn0gL7ch7vEo9Jua1MqaH"; // Replace with your Jetton wallet address
    const tokenRecipients = [
        { address: "0QB_GJN-uJ85M3WMbKL-Rk25q3aCECgYAedRefgVTD4Lblil", amount: 1 }, // Replace with your recipient addresses
    ];

    const tokenUserList = Dictionary.empty<bigint, Address>();
    const tokenSendingValue = Dictionary.empty<bigint, bigint>();
    tokenRecipients.forEach((recipient, index) => {
        tokenUserList.set(BigInt(index), Address.parse(recipient.address));
        tokenSendingValue.set(BigInt(index), BigInt(recipient.amount));
    });

    // Create MultiSendToken message
    const multiSendTokenMessage: MultiSendToken = {
        $$type: "MultiSendToken",
        length: BigInt(tokenRecipients.length),
        sender_jetton_wallet: Address.parse(jettonWalletHex),
        token_user_list: tokenUserList,
        token_sending_value: tokenSendingValue,
    };

    try {
        // Send the MultiSendToken message
        await contract.send(provider.sender(), { value: toNano('0.08') }, multiSendTokenMessage);
        console.log('Jettons sent to multiple users successfully!');
    } catch (error: any) {
        console.error('Failed to send Jettons:', error.message);
        if (error.details) {
            console.error('Error Details:', error.details);
        }
    }
}
