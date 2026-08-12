export function currentMonth() {
  const now = new Date();

  return {
    start: new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ),
    end: now,
  };
}

export function previousMonth() {
  const now = new Date();

  const start = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    0
  );

  return {
    start,
    end,
  };
}

export function currentFinancialYear() {
  const now = new Date();

  const year =
    now.getMonth() >= 3
      ? now.getFullYear()
      : now.getFullYear() - 1;

  return {
    start: new Date(year, 3, 1),
    end: now,
  };
}