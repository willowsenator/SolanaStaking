import {Connection, clusterApiUrl} from "@solana/web3.js"
const main = async()=>{
    const connection = new Connection(clusterApiUrl('devnet'), 'processed');
    const {current, delinquent} = await connection.getVoteAccounts();
    console.log('Total Validators: ', current.concat(delinquent).length);
    console.log('Current validators: ', current.length);
    console.log(current[0]);
}

const runMain = async()=>{
    try {
        await main();
    }
    catch(error){
        console.error(error);
    }
}
runMain().then(() => console.log("Getting validators OK"));