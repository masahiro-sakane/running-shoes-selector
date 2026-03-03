"use client";

import { useCompare } from "@/contexts/CompareContext";
import { COMPARE_MAX_ITEMS } from "@/lib/utils/constants";

interface AddToCompareButtonProps {
  shoeId: string;
  shoeName: string;
  compact?: boolean;
}

export default function AddToCompareButton({
  shoeId,
  shoeName,
  compact = false,
}: AddToCompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, isFull } = useCompare();
  const inCompare = isInCompare(shoeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(shoeId);
    } else if (!isFull) {
      addToCompare(shoeId);
    }
  };

  const disabled = !inCompare && isFull;

  if (compact) {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        title={
          inCompare
            ? "比較リストから削除"
            : disabled
            ? `比較リストは最大${COMPARE_MAX_ITEMS}足まで`
            : `${shoeName}を比較に追加`
        }
        style={{
          width: "28px",
          height: "28px",
          border: `2px solid ${inCompare ? "#0052cc" : "#dfe1e6"}`,
          borderRadius: "4px",
          background: inCompare ? "#0052cc" : "#ffffff",
          color: inCompare ? "#ffffff" : disabled ? "#97a0af" : "#42526e",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.15s",
        }}
      >
        {inCompare ? "✓" : "+"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        padding: "8px 16px",
        border: `2px solid ${inCompare ? "#0052cc" : disabled ? "#dfe1e6" : "#0052cc"}`,
        borderRadius: "4px",
        background: inCompare ? "#0052cc" : "#ffffff",
        color: inCompare ? "#ffffff" : disabled ? "#97a0af" : "#0052cc",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: "13px",
        fontWeight: 600,
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {inCompare ? "✓ 比較中" : disabled ? `上限${COMPARE_MAX_ITEMS}足` : "+ 比較に追加"}
    </button>
  );
}
