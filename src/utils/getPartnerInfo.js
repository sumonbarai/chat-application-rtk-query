const getPartnerInfo = (users, loggedInUserEmail) => {
  const partnerInfo = users.find((user) => user.email !== loggedInUserEmail);
  return partnerInfo;
};
export default getPartnerInfo;
