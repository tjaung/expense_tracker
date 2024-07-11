

const retrieveAccessTokenByUserId = async userId => {
    const filter = { '_id': userId }
    const select = {'plaidToken'}
  const query = 
    
    values: [userId],
  };
  const { rows: accounts } = await db.query(query);
  return accounts;
};