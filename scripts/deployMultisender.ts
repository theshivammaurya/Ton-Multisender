// import { toNano, Address } from '@ton/core';
// import { MultiSender } from '../wrappers/Multisender';
// import { NetworkProvider } from '@ton/blueprint';

// export async function run(provider: NetworkProvider) {
//     // Generate a random queryId for each deployment
//     const randomValue = Math.floor(Math.random() * 1e18); 
//     const uniqueQueryId: bigint = BigInt(randomValue);  
//     const user1KeyHex = '0QDjA6qGPrq3HcDrEe9kRfVbN7iy42JWieZDW9fMihZlSFq6';
//     const adminAddress = Address.parse(user1KeyHex);



//     // Open a new instance of the contract
//     const multisender = provider.open(await MultiSender.fromInit(adminAddress));

//     await multisender.send(
//         provider.sender(),
//         {
//             value: toNano('0.05'), 
//         },
//         {
//             $$type: 'Deploy',
//             queryId: uniqueQueryId, 
//         }
//     );

//     // Wait for the contract deployment to complete
//     await provider.waitForDeploy(multisender.address);
//     console.log(`MultiSender deployed at: ${multisender.address}`);
// }



import { toNano, Address } from '@ton/core';
import { MultiSender } from '../wrappers/Multisender';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // Generate a random queryId for each deployment
    const uniqueQueryId = BigInt(Math.floor(Math.random() * 1e18)); 

    // Admin address for the contract
    const adminAddressHex = '0QDjA6qGPrq3HcDrEe9kRfVbN7iy42JWieZDW9fMihZlSFq6';
    const adminAddress = Address.parse(adminAddressHex);

    // Deploy the contract
    const multisender = provider.open(await MultiSender.fromInit(adminAddress));
    await multisender.send(provider.sender(), { value: toNano('0.05') }, { $$type: 'Deploy', queryId: uniqueQueryId });

    // Wait for the deployment to complete
    await provider.waitForDeploy(multisender.address);
    console.log(`MultiSender contract deployed at: ${multisender.address}`);
}
