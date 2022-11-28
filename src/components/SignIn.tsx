import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import '../App.css';
import Web3Provider from '../providers/Web3Provider';

function SignIn(props: any) {
    const [loading, setLoading] = useState(false);
    const [signedIn, setSignedIn] = useState(false);
    
    const provider = props.provider as Web3Provider;

    useEffect(() => {
        const signIn = (async () => {
            const sig = await provider.signInWithEthereum();

            // normally API calls with nonce, headers, etc.
            const valid = await provider.validateSignInAttempt(sig[1], sig[0], sig[2]);
            if (valid) {
                setSignedIn(true);
            }
        });

        if (loading && provider.isConnected && !signedIn) {
            signIn();
        }

        return () => { };
    }, [ loading ]);

    return  (
        <Stack direction="row" spacing={2}>
            { (!signedIn) ?
                <div>
                    <Button variant="contained" onClick={() => setLoading(true)}>Sign in with Ethereum</Button>    
                </div>
                :
                <Alert severity="success">
                    <AlertTitle>Signed-in</AlertTitle>
                    You have successfully signed-in.
                </Alert>
            }
        </Stack>
    );
}

export default SignIn;
