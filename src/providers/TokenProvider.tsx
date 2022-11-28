import { ethers } from 'ethers';
import { Network, Alchemy, TokenBalanceType, TokenMetadataResponse } from "alchemy-sdk";

export class TokenAddressBalance {
    constructor(
        public balance: string | null,
        public id: string | null, // token address
        public logo: string | null,
        public symbol: string | null,
        public tokenName: string | null,
        public decimals: number | null) {
            this.calculateBalance();
        };
    
    private calculateBalance() {
        if (this.balance && this.decimals) {
            const bnBal = ethers.BigNumber.from(this.balance).div(ethers.BigNumber.from(10).pow(this.decimals));
            this.balance = bnBal.toString();
        }
    }
}

export default class TokenProvider {
    public provider: Alchemy;
    private tokenMetadataStore: Map<string, TokenMetadataResponse> = new Map<string, TokenMetadataResponse>();

    constructor(public alchemyApiKey: string) {
        this.provider = new Alchemy({
            apiKey: alchemyApiKey,
            network: Network.ETH_MAINNET,
        })
    }

    // TODO: add in for optimization for large token balances so we can cache some values, abandoned code, delete if not used in a bit
    private async getOrSaveMetadata(contract: string): Promise<TokenMetadataResponse | undefined> {
        let ret: TokenMetadataResponse | undefined;
        if (this.tokenMetadataStore.has(contract)) {
            ret = this.tokenMetadataStore.get(contract);
        } else {
            const mdResponse = await this.provider.core.getTokenMetadata(contract);
            this.tokenMetadataStore.set(contract, mdResponse);
        }
        return ret;
    }

    public async getBalances(address: string): Promise<TokenAddressBalance[]> {
        const ret = new Array<TokenAddressBalance>();

        // top 100 tokens, super heavy, good enough for demo not for prod
        const balanceResp = await this.provider.core.getTokenBalances(address, { type: TokenBalanceType.ERC20 });

        // for some reason .map and .forEach didn't work here - had to put in this for loop, something to do with the returned array being immutable
        for (let i = 0; balanceResp.tokenBalances.length > i; i++) {
            const tokenBalance = balanceResp.tokenBalances[i];

            if (!tokenBalance.error) {
                const metadata = await this.provider.core.getTokenMetadata(tokenBalance.contractAddress);
                if (!metadata) throw new Error('invalid metadata');

                ret.push(new TokenAddressBalance( 
                    tokenBalance.tokenBalance,
                    tokenBalance.contractAddress,
                    metadata.logo, 
                    metadata.symbol,
                    metadata.name,
                    metadata.decimals,   
                ));
            }
        }

        return ret;
    }

   
}