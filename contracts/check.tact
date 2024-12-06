import "@stdlib/deploy";
import "@stdlib/ownable";

message MultiSendJetton {
    length: Int;                      
    sender_jetton_wallet: Address;    
    token_user_list: map<Int, Address>; 
    token_sending_value: map<Int, Int>; 
}

message TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;             
    destination: Address;             
    response_destination: Address;    
    custom_payload: Cell?;
    forward_ton_amount: Int as coins; 
    forward_payload: Slice as remaining;
}

// Contract for batch transferring Jetton tokens
contract JettonMultiSender with Deployable {
    const minTonsForStorage: Int = ton("0.03"); 
    const gasConsumption: Int = ton("0.03");  

    init() { }

    receive(msg: MultiSendJetton) {
        let ctx: Context = context();              
        let msgValue: Int = ctx.value;            
        let senderWallet: Address = ctx.sender;    

        let value_default: Int = 0;
        let sendingValue: Int = 0;

        do {
            let receiver: Address? = msg.token_user_list.get(value_default);  
            let token_send_amount: Int? = msg.token_sending_value.get(value_default);
            sendingValue = sendingValue + token_send_amount!!;              

            // Send tokens using the TokenTransfer message
            send(SendParameters{
                to: msg.sender_jetton_wallet,
                value: ton("0.1"),  
                mode: SendIgnoreErrors,
                bounce: false,     
                body: TokenTransfer {
                    queryId: value_default,
                    amount: token_send_amount!!,
                    destination: receiver!!,
                    response_destination: ctx.sender,
                    custom_payload: null,
                    forward_ton_amount: ton("0.05"),
                    forward_payload: emptySlice()
                }.toCell()
            });

            value_default = value_default + 1;
        } until (value_default >= msg.length);

        // Send back the remaining value to the sender
        self.completed(ctx.sender, msgValue - sendingValue);
    }

    //  function to complete the transaction and send back any remaining value
    fun completed(to_address: Address, value: Int) {
        send(SendParameters{
            to: to_address,
            value: value,  // Return remaining value
            mode: SendIgnoreErrors,
            bounce: false,
            body: "Batch Completed".asComment()
        });
    }

    // Fallback receive method to handle unexpected messages
    receive() {
        let ctx: Context = context();
        send(SendParameters{
            to: ctx.sender,
            value: 0,
            mode: SendIgnoreErrors,
            bounce: false
        });
    }
}
