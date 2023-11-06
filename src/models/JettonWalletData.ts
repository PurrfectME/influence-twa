import { Address, Cell } from "ton-core";

export default class JettonWalletData {
    balance: bigint;
    owner: Address;
    master: Address;
    walletCode: Cell;

    constructor(balance: bigint, owner: Address, master: Address, walletCode: Cell){
        this.balance = balance;
        this.owner = owner;
        this.master = master;
        this.walletCode = walletCode;
    }
}