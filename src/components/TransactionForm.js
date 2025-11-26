import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES } from '../graphql/queries';

const TransactionForm = () => {
    const [montant, setMontant] = useState('');
    const [type, setType] = useState('DEPOT');
    const [compteId, setCompteId] = useState('');

    const { data: comptesData } = useQuery(GET_ALL_COMPTES);
    const [addTransaction] = useMutation(ADD_TRANSACTION);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!compteId) {
            alert("Veuillez sélectionner un compte");
            return;
        }
        try {
            await addTransaction({
                variables: {
                    transaction: {
                        montant: parseFloat(montant),
                        type,
                        compteId,
                        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
                    },
                },
            });
            setMontant('');
            setType('DEPOT');
        } catch (error) {
            console.error('Erreur lors de la création de la transaction :', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Nouvelle Transaction</h3>
            <label>
                Compte :
                <select
                    value={compteId}
                    onChange={(e) => setCompteId(e.target.value)}
                    required
                >
                    <option value="">Sélectionner un compte</option>
                    {comptesData && comptesData.allComptes.map((compte) => (
                        <option key={compte.id} value={compte.id}>
                            {compte.type} - {compte.id} (Solde: {compte.solde}€)
                        </option>
                    ))}
                </select>
            </label>
            <br />
            <label>
                Montant :
                <input
                    type="number"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    required
                    placeholder="Montant"
                />
            </label>
            <br />
            <label>
                Type :
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="DEPOT">Dépôt</option>
                    <option value="RETRAIT">Retrait</option>
                </select>
            </label>
            <br />
            <button type="submit">Ajouter Transaction</button>
        </form>
    );
};

export default TransactionForm;
