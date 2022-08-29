import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL, StakeProgram, Lockup, Authorized, sendAndConfirmTransaction
} from "@solana/web3.js"
const main = async()=>{
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const wallet = Keypair.generate();
    const airdropSignature = await connection.requestAirdrop(wallet.publicKey, LAMPORTS_PER_SOL);

    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: airdropSignature,
    });

   const stakeAccount = Keypair.generate();
   const minimunToRent = await connection.getMinimumBalanceForRentExemption(StakeProgram.space);
   const amountUserWantsToStake = 0.5 * LAMPORTS_PER_SOL;
   const amountToStake = amountUserWantsToStake + minimunToRent;
   const createStakeAccountTx = await StakeProgram.createAccount({
       lamports: amountToStake,
       lockup: new Lockup(0,0, wallet.publicKey),
       fromPubkey: wallet.publicKey,
       stakePubkey: stakeAccount.publicKey,
       authorized: new Authorized(wallet.publicKey, wallet.publicKey)
   });
   const createStakeAccountTxId = await sendAndConfirmTransaction(connection, createStakeAccountTx,[wallet, stakeAccount]);

   console.log(`Stake account created. TxId: ${createStakeAccountTxId}`);
   let stakeBalance = await connection.getBalance(stakeAccount.publicKey);
   console.log(`Stake account balance. ${stakeBalance/LAMPORTS_PER_SOL} SOL`);
   let stakeStatus = await connection.getStakeActivation(stakeAccount.publicKey);
   console.log(`Stake status. ${stakeStatus.state}`);
}

const runMain = async()=>{
    try {
        await main();
    }
    catch(error){
        console.error(error);
    }
}
runMain().then(() => console.log("Creating staking account OK"));