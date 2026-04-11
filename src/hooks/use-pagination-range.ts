// src/hooks/use-pagination-range.ts
export const DOTS = "...";

export const usePaginationRange = (
  totalPages: number,
  currentPage: number,
  siblings = 1,
) => {
  const range = [];
  const totalNumbers = siblings * 2 + 3; // current + siblings + first + last + dots

  if (totalPages <= totalNumbers) {
    for (let i = 1; i <= totalPages; i++) range.push(i);
    return range;
  }

  const leftSiblingIndex = Math.max(currentPage - siblings, 1);
  const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 2;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblings;
    for (let i = 1; i <= leftItemCount; i++) range.push(i);
    range.push(DOTS);
    range.push(totalPages);
  } else if (showLeftDots && !showRightDots) {
    range.push(1);
    range.push(DOTS);
    const rightItemCount = 3 + 2 * siblings;
    for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++)
      range.push(i);
  } else {
    range.push(1);
    range.push(DOTS);
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) range.push(i);
    range.push(DOTS);
    range.push(totalPages);
  }

  return range;
};
