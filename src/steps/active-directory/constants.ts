export const steps: Record<string, string> = {
  FETCH_ACCOUNT: 'Fetch account',
};

export const entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'microsoft_defender_account',
    _class: ['Account'],
  },
};

export const DATA_ACCOUNT_ENTITY = entities.ACCOUNT._type;
