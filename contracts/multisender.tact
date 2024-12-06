import "@stdlib/deploy"; 
import "@stdlib/ownable"; 

message MultiSendTON {
    length: Int;  // Number of recipients
    ton_user_list: map<Int, Address>;  
    ton_sending_value: map<Int, Int>;  
}

message MultiSendToken {
    length: Int;  // Number of recipients
    sender_jetton_wallet: Address;  // Ownertoken wallet address
    token_user_list: map<Int, Address>; 
    token_sending_value: map<Int, Int>;  
}

message TokenTransfer {
    query_id: Int as uint64;
    amount: Int as coins;  // Amount of tokens to transfer
    destination: Address; 
    response_destination: Address;  // Where to send the response
    custom_payload: Cell?;
    forward_ton_amount: Int as coins;
    forward_payload: Slice as remaining;
}


// Owner sends TON or tokens to multiple users
contract MultiSender with Deployable {
    const minTonsForStorage: Int = ton("0.03");
    admin: Address;
    const gasConsumption: Int = ton("0.03");

    init(admin: Address) {self.admin = admin;}
  

    // Method for sending TON to multiple users
    receive(msg: MultiSendTON) {
        let ctx: Context = context();
        let msgValue: Int = ctx.value;

        let value_default: Int = 0;
        let sendingValue: Int = 0;

        do {
            let receiver: Address? = msg.ton_user_list.get(value_default);  // Get recipient address
            let value_send: Int? = msg.ton_sending_value.get(value_default);  // Get corresponding amount of TON to send
            sendingValue = value_send!! + sendingValue;  // Sum up total sending value

            // Send TON to the recipient
            send(SendParameters{
                to: receiver!!,
                value: value_send!!,
                mode: SendIgnoreErrors,  
                bounce: false
            });

            value_default = value_default + 1;
        } until (value_default >= msg.length);

        // Send remaining value back to the sender
        self.completed(ctx.sender, msgValue - sendingValue);
    }

    // Method for sending tokens to multiple users
    receive(msg: MultiSendToken) {
        let ctx: Context = context();
        let msgValue: Int = ctx.value; 

        let value_default: Int = 0;
        let sendingValue: Int = 0;

        do {
            let receiver: Address? = msg.token_user_list.get(value_default);  // Get recipient address
            let token_send_amount: Int? = msg.token_sending_value.get(value_default);  // Get corresponding token amount to send
            sendingValue = sendingValue + token_send_amount!!;  // Sum up total token amount

            // Send token using the TokenTransfer message
            send(SendParameters{
                to: msg.sender_jetton_wallet,  // Sender's token wallet
                value: ton("0.08"), 
                mode: SendIgnoreErrors,  
                bounce: false,
                body: TokenTransfer {
                    query_id: value_default, 
                    amount: token_send_amount!!,
                    destination: receiver!!,
                    response_destination: myAddress(),
                    custom_payload: null,
                    forward_ton_amount: ton("0.05"),
                    forward_payload: emptySlice()
                }.toCell()
            });

            value_default = value_default + 1;
        } until (value_default >= msg.length);

        // Send remaining value back to the sender
        self.completed(ctx.sender, msgValue - sendingValue);
    }

    // Default receive method to handle fallback
    receive() {
        let ctx: Context = context();
        send(SendParameters{
            to: ctx.sender,
            value: 0, 
            //mode: SendIgnoreErrors + SendRemainingBalance,
             mode: SendIgnoreErrors,
            bounce: false
        });
    }

    // Helper function to complete the transaction
    fun completed(to_address: Address, value: Int) {
        send(SendParameters{
            to: to_address,
            value: value,  // msgValue - sendingValue
            mode: SendIgnoreErrors, 
            bounce: false,
            body: "Complete".asComment()
        });
    }

    // Renamed function to calculate message value after gas and storage fee
    fun calculateMsgValue(msgValue: Int): Int {
        let tonBalanceBeforeMsg: Int = myBalance() - msgValue;
        let storageFee: Int = self.minTonsForStorage - min(tonBalanceBeforeMsg, self.minTonsForStorage);
        msgValue = msgValue - (storageFee + self.gasConsumption);
        return msgValue;
    }
}
