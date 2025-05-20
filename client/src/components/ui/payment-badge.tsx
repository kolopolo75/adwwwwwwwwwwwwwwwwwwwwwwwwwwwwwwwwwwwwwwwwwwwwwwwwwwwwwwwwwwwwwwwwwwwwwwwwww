interface PaymentBadgeProps {
  paymentStatus: string;
  amountPaid?: string;
  remainingAmount?: string;
}

export function PaymentBadge({ paymentStatus, amountPaid, remainingAmount }: PaymentBadgeProps) {
  let className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  let displayText = paymentStatus;
  
  switch (paymentStatus) {
    case "Pendente":
      className += " bg-red-100 text-red-800";
      if (amountPaid && remainingAmount) {
        displayText = `Pendente: R$ ${remainingAmount}`;
      }
      break;
    case "Pagamento Parcial":
      className += " bg-yellow-100 text-yellow-800";
      if (amountPaid && remainingAmount) {
        displayText = `Pago: R$ ${amountPaid} | Falta: R$ ${remainingAmount}`;
      }
      break;
    case "Pago 100%":
      className += " bg-green-100 text-green-800";
      if (amountPaid) {
        displayText = `Pago: R$ ${amountPaid}`;
      }
      break;
    default:
      className += " bg-gray-100 text-gray-800";
  }
  
  return (
    <span className={className}>
      {displayText}
    </span>
  );
}