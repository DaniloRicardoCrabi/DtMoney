import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { api } from '../services/api';

interface Transaction {
  id:number;
  title: string;
  amount: number;
  type: string;
  category:string;
  createdAt: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>; 
/* 
O TRansactionInput vai herdar todo o Transaction MENOS o 'id e o 'createdAt';

Poderíamos usar também o 'Pick', adicionando todos os campos que será usado  ficaria:
type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type' | 'category' >;
*/

interface TransactionProviderProps {
  children: ReactNode;
}

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;

}

const TransactionsContext = createContext<TransactionsContextData>(
  { } as TransactionsContextData
  );

export function TransactionsProvider({ children }: TransactionProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get('transactions')
    .then(response => setTransactions(response.data.transactions))
  }, []);

    async function createTransaction(transactionInput: TransactionInput) {
     const response = await api.post('/transactions', 
     {
       ...transactionInput,
       createdAt: new Date(),
      })
     const { transaction } = response.data;

     setTransactions([
       ...transactions,
        transaction,
     ])
    }

    return (
      <TransactionsContext.Provider value={{transactions, createTransaction }}>
          {children}
      </TransactionsContext.Provider>
    )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
} 