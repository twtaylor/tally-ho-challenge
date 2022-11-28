import React, { useState, useEffect, useContext, FunctionComponent } from 'react';
import '../App.css';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Web3Provider from '../providers/Web3Provider';
import TokenProvider, { TokenAddressBalance } from '../providers/TokenProvider';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

// TODO: get from env but already in a public repo.. so...
const ALCHEMY_KEY = "_ArbR3W9Ttz3Cx1Ofa_vVhcIxzxbx7tC";

function TokenBalances(props: any) {
    const defaultBals: TokenAddressBalance[] = [];

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState(defaultBals);
    
    const provider = props.provider as Web3Provider;
    const tokenProvider = new TokenProvider(ALCHEMY_KEY);

    useEffect(() => {
        const fetchBalances = (async () => {
            // const address = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // vitalik address for test purposes only
            const address = provider.address;
            const balances = await tokenProvider.getBalances(address);
            setRows(balances);
            setLoading(false);
        });

        if (loading && provider.isConnected && provider.address && rows.length === 0) {
            fetchBalances();
        }

        return () => { };
    }, [ loading, rows ]);

    const columns: GridColDef[] = [
        { field: 'logo', headerName: 'Token Icon', width: 130, renderCell: (params) => <img src={params.value} />, },
        { field: 'balance', headerName: 'Current Balance', width: 330, },
        { field: 'symbol', headerName: 'Token symbol', width: 130 },
        { field: 'tokenName', headerName: 'Token name', width: 330 },
        { field: 'id', headerName: 'Contract address', width: 530 },
    ];

    return  (
        <div style={{ height: 400, width: '100%' }}>
            <Button variant="contained" size="medium" onClick={() => setLoading(true)}>Fetch Balances</Button>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
            />
        </div>
    );
}

export default TokenBalances;
