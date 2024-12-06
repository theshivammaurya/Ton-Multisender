import { Address, beginCell } from "@ton/core"
import { TonClient, JettonMaster } from "@ton/ton"
import TonWeb from "tonweb";


export async function run() {
    const apiKey = "c6d398b952d0421fffcfb2017b1f5bf0ec978afcccc86879e8405b8ab68dc5ec";

    const client = new TonClient({
        endpoint: "https://testnet.toncenter.com/api/v2/jsonRPC",
    });
    
    try {
        const jettonMasterAddress = Address.parse('kQAs9j5BPMf376bDw7M7DczRByAR6KC409dEZ1gRyHzlf5Ep');
        const jettonMaster = client.open(JettonMaster.create(jettonMasterAddress));
        const walletAddress = await jettonMaster.getWalletAddress(
            Address.parse('0QDgO_Y4qGyiexBTGcerYWrYk6xFMdoSxI3eYIb0uWWkbYez')
        );

        console.log("Wallet connected successfully. Address:", walletAddress.toString());


        const tonweb = new TonWeb(new TonWeb.HttpProvider(`https://testnet.toncenter.com/api/v2/jsonRPC?api_key=${apiKey}`));

        const jettonWalletContract = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
            address: walletAddress.toString(),
        });

        // Fetch balance using Jetton Wallet contract's getData method
        const walletData = await jettonWalletContract.getData();
        console.log("Jetton Wallet Balance:", walletData.balance.toString());
    } catch (error) {
        console.error("Wallet connection failed:", error);
    }
}


