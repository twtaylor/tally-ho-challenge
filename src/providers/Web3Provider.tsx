import { ethers } from 'ethers';
import { SiweMessage, generateNonce } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;

const SIGN_IN_MSG = "Sign in with Ethereum to use the app.";

export default class Web3Provider {
    public provider: ethers.providers.Web3Provider;

    public isSignedIn: boolean = false;
    public isConnected: boolean = false;
    public isTallyWallet: boolean = false;
    public address: string = "";
    public chainId: number = 0x1; // TODO: default to something less dangerous

    constructor() {
        if ((window as any).ethereum) {
            this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
        } else if ((window as any).web3) {
            this.provider = new ethers.providers.Web3Provider((window as any).web3.currentProvider);
        } else {
            throw new Error("no web3 wallet");
        }
    }

    public async connect() {
        return this.provider
        .send('eth_requestAccounts', [])
        .catch(() => console.error('user rejected request'))
        .then(async (val) => {
            this.isConnected = !!val;

            if (this.isConnected) {
                this.isTallyWallet = this.provider.connection.url === "eip-1193:" || false;
                this.address = await this.provider.getSigner().getAddress();
                this.chainId = this.provider.network.chainId;
            }

            return this.isConnected;
        });
    }

    private createSiweMessage(address: string, statement: string, nonce: string, issuedAt: string) {
        const message = new SiweMessage({
            domain,
            address,
            statement,
            uri: origin,
            version: '1',
            chainId: this.chainId,
            nonce,
            // we caught a bug in SIWE transpilation, they are not shimming in a replacement for Buffer
            // we cannot actually pass issuedAt in the client for verification (this might be a vuln specific to this
            // version of SIWE). maybe it's fixed in another version.
            // issuedAt,
        });
        
        return message;
    }

    public async signEIP712Message(msg: string) {
        // TODO: deploy an "official" contract with these items for verification
        const verifyingContract = "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC";

        // the id of the message we want to store locally
        const id = Math.floor(Math.random() * 10000000000);

        // construct our large EIP712 envelope
        const domain = {
            name: 'TallyChallenge',
            version: '1',
            chainId: this.chainId,
            verifyingContract,
        };

        const types = {
            Bottle: [
              { name: 'message', type: 'string' },
              { name: 'signer', type: 'address' },
              { name: 'timestamp', type: 'uint256' },
              { name: 'bottleId', type: 'uint256' }
            ]
        };

        const value = {
            message: msg,
            signer: this.address,
            timestamp: Date.now(),
            bottleId: id,
        };

        const signature = await this.provider.getSigner()._signTypedData(domain, types, value);
        
        return [ id, signature ];
    }

    /**
     * Signs into the Wallet provider via SIWE
     * @returns 
     */
    public async signInWithEthereum() {
        const nonce = generateNonce();
        const dt = new Date().toISOString();

        const message = this.createSiweMessage(
            this.address,
            SIGN_IN_MSG,
            nonce,
            dt,
        );

        try {
            // TODO: probably save nonce to prevent replays but really low imp
            const msg = await this.provider.getSigner().signMessage(message.prepareMessage());
            
            this.isSignedIn = !!msg;

            return [ nonce, msg, dt ];
        } catch (e) {
            console.error('An error occurred with sign-in:');
            console.error(e);

            this.isSignedIn = false;
        }

        return [ "", "", "" ];
    }

    /**
     * Mock for validating a sign-in attempt.
     * @param signature 
     * @param nonce 
     * @param issuedAt 
     * @returns 
     */
    public async validateSignInAttempt(signature: string, nonce: string, issuedAt: string) {
        const message = this.createSiweMessage(
            this.address,
            SIGN_IN_MSG,
            nonce,
            issuedAt,
        );

        try {
            return !!message.validate(signature);
        } catch (e) {
            // fails, see message construction above for the root error
        }
    
        return true;
    }
}