export const createRules = async function (
  connection,
  { campgroundId, checkInStart, checkInEnd, checkOutStart, checkOutEnd, cancellationPolicy, cash, card, upi },
) {
  const [result] = await connection.query(
    `INSERT INTO Rules (campgroundId,checkInStart,checkInEnd,checkOutStart,checkOutEnd,cancellationPolicy,cash,card,upi) VALUES (?,?,?,?,?,?,?,?,?)`,
    [campgroundId, checkInStart, checkInEnd, checkOutStart, checkOutEnd, cancellationPolicy, cash, card, upi],
  );
  return result;
};

export const getCampgroundRules = async function (connection, campgroundId) {
  const [rows] = await connection.query("SELECT * FROM Rules WHERE campgroundId = ?", campgroundId);
  return rows;
};
