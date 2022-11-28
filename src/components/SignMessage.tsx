import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import TextField from '@mui/material/TextField';

import '../App.css';
import Web3Provider from '../providers/Web3Provider';

function SignMessage(props: any) {
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [bottleId, setBottleId] = useState("");

    const onChangeHandler = (event: any) => {
        setMessage(event.target.value);
     };
    
    const provider = props.provider as Web3Provider;

    useEffect(() => {
        const signMsg = (async () => {
            const signedMsg = await provider.signEIP712Message(message);
            const bottleId = "bottle " + signedMsg[0];
            localStorage.setItem(bottleId, String(signedMsg[1]));
            setBottleId(bottleId);
        });

        if (loading && provider.isConnected && provider.isSignedIn) {
            signMsg();
        }

        return () => { };
    }, [ loading ]);

    return  (
        <Stack direction="row" spacing={2}>
            <TextField id="outlined-basic" label="Message Text" variant="outlined" multiline rows={4} onChange={onChangeHandler} value={message} />

            { (!bottleId) ?
            <div>
                <Button variant="contained" onClick={() => setLoading(true)}>Sign message</Button>
            </div>
            :
            <Alert severity="success">
                <AlertTitle>Signed</AlertTitle>
                You have signed the message with local storage locator: {bottleId}.
            </Alert>
            }
        </Stack>
    );
}

export default SignMessage;
