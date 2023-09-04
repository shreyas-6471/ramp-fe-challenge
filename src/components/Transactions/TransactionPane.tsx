import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";
import { useState, useEffect } from "react";  // Added useEffect import

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);

  // Added useEffect to initialize checkbox state from local storage
  useEffect(() => {
    const savedApproval = localStorage.getItem(`transaction-${transaction.id}-approved`);
    if (savedApproval !== null) {
      setApproved(JSON.parse(savedApproval));
    }
  }, [transaction.id]);

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          });

          // Added line to save checkbox state to local storage
          localStorage.setItem(`transaction-${transaction.id}-approved`, JSON.stringify(newValue));

          setApproved(newValue);
        }}
      />
    </div>
  );
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});


