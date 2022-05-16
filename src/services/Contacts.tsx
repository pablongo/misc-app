import client from "../../client";

export const getContacts = (numbers: string[]) => {
  return client.post('/api/auth/getContacts', {
    phoneNumbers: numbers,
  });
};



