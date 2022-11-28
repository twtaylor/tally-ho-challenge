import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import Web3Provider from '../providers/Web3Provider';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

function Connect(props: any) {
    const [loading, setLoading] = useState(false);
    const [isConnected, setWalletConnected] = useState(false);
    const [isTallyWallet, setIsTallyWallet] = useState(false);
    const [address, setAddress] = useState("");

    const provider = props.provider as Web3Provider;

    useEffect(() => {
        const connect = (async () => {
            const didConnect = await provider.connect();

            setWalletConnected(didConnect);
            setIsTallyWallet(provider.isTallyWallet);
            setAddress(provider.address);
        });

        if (loading) {
            connect();
        }

        return () => { };
    }, [ loading ]);

    return  (
        <Stack direction="row" spacing={2}>
            { (!provider.isConnected) ?
            <div>
                <Button variant="contained" onClick={() => setLoading(true)}>Connect Wallet</Button>
            </div>
            :
            <></>
            }
            { isConnected ?
            <Alert severity="success">
                <AlertTitle>Connected</AlertTitle>
                You have successfully connected — { isTallyWallet ? <strong> "with a Tally wallet!" </strong> : "Unknown/metamask wallet" } 
                <p>
                    <u>Address:</u> { address }
                </p>
            </Alert>
            :
            <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                You have to Connect your Wallet before you can perform any action.
            </Alert>
            }
        </Stack>
    );
}

Connect.propTypes = {
    provider: PropTypes.object,
};

export default Connect;
