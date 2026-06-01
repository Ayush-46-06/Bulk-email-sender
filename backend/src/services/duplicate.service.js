import Lead from "../models/Lead.js";

export const checkDuplicateLead = async (
  email,
  phone
) => {

  const duplicate =
    await Lead.findOne({
      $or: [
        { email },
        { phone }
      ]
    });

  return duplicate;
};