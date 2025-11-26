import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_TRANSACTIONS } from '../graphql/queries';

const TransactionList = () => {
    const { loading, error, data } = useQuery(GET_ALL_TRANSACTIONS);

    if (loading) return <p>Chargement des transactions...</p>;
    if (error) return <p>Erreur : {error.message}</p>;

    return (
        <div>
            <h2>Historique des Transactions</h2>
            <ul>
                {data.allTransactions.map((transaction) => (
                    <li key={transaction.id} className="border-b py-2">
                        <span className={`font-bold ${transaction.type === 'DEPOT' ? 'text-green-600' : 'text-red-600'}`}>
                            {transaction.type}
                        </span>
                        : {transaction.montant}€ le {new Date(transaction.date).toLocaleDateString()}
                        (Compte: {transaction.compte.type})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
