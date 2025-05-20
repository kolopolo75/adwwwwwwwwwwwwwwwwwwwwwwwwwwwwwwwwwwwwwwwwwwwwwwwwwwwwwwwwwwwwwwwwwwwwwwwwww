interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let className = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  
  switch (status) {
    case "In Production":
    case "Em Produção":
      className += " bg-yellow-100 text-yellow-800";
      break;
    case "Completed":
    case "Finalizado":
      className += " bg-green-100 text-green-800";
      break;
    case "Canceled":
    case "Cancelado":
      className += " bg-red-100 text-red-800";
      break;
    default:
      className += " bg-gray-100 text-gray-800";
  }
  
  return (
    <span className={className}>
      {status}
    </span>
  );
}
