// Mock transaction history for all users
// visibility: 'public' | 'private'

export const mockTransactions = {
  '1': { // Tamir Mizrahi
    visibility: 'public',
    transactions: [
      { id: 't1', type: 'buy', targetId: '9', targetName: 'Yehuda Mizrahi', amount: 1200, price: 36000, date: '2025-02-10', return: +7.2 },
      { id: 't2', type: 'buy', targetId: '12', targetName: 'Dovi Frances', amount: 5000, price: 310000, date: '2025-01-22', return: +10.3 },
      { id: 't3', type: 'sell', targetId: '3', targetName: 'Oren Cohen', amount: 2000, price: 91000, date: '2025-03-01', return: +18.4 },
      { id: 't4', type: 'buy', targetId: '15', targetName: 'Ahavat Hashem Gordon', amount: 800, price: 44000, date: '2025-03-05', return: +18.2 },
    ],
  },
  '9': { // Yehuda Mizrahi
    visibility: 'public',
    transactions: [
      { id: 't1', type: 'buy', targetId: '1', targetName: 'Tamir Mizrahi', amount: 3000, price: 68000, date: '2025-01-15', return: +9.1 },
      { id: 't2', type: 'buy', targetId: '12', targetName: 'Dovi Frances', amount: 8000, price: 295000, date: '2024-12-01', return: +15.9 },
      { id: 't3', type: 'buy', targetId: '10', targetName: 'Yehuda Levi', amount: 2500, price: 112000, date: '2025-02-20', return: +14.3 },
      { id: 't4', type: 'sell', targetId: '7', targetName: 'Yossi Peretz', amount: 1500, price: 71000, date: '2025-03-03', return: +6.0 },
      { id: 't5', type: 'buy', targetId: '15', targetName: 'Ahavat Hashem Gordon', amount: 500, price: 40000, date: '2025-03-06', return: +30.0 },
    ],
  },
  '12': { // Dovi Frances
    visibility: 'public',
    transactions: [
      { id: 't1', type: 'buy', targetId: '1', targetName: 'Tamir Mizrahi', amount: 15000, price: 55000, date: '2024-11-01', return: +34.9 },
      { id: 't2', type: 'buy', targetId: '9', targetName: 'Yehuda Mizrahi', amount: 20000, price: 28000, date: '2024-10-15', return: +37.9 },
      { id: 't3', type: 'buy', targetId: '15', targetName: 'Ahavat Hashem Gordon', amount: 10000, price: 35000, date: '2025-01-10', return: +48.6 },
      { id: 't4', type: 'buy', targetId: '14', targetName: 'Omer Adam', amount: 25000, price: 140000, date: '2024-09-20', return: +33.6 },
      { id: 't5', type: 'sell', targetId: '6', targetName: 'Noa Ben David', amount: 3000, price: 15000, date: '2025-02-28', return: -18.0 },
      { id: 't6', type: 'buy', targetId: '11', targetName: 'Eyal Shani', amount: 30000, price: 180000, date: '2024-08-01', return: +19.4 },
    ],
  },
  '3': { visibility: 'private', transactions: [] },
  '2': { visibility: 'private', transactions: [] },
  '4': { visibility: 'private', transactions: [] },
  '5': { visibility: 'private', transactions: [] },
  '6': { visibility: 'private', transactions: [] },
  '7': { visibility: 'private', transactions: [] },
  '8': { visibility: 'private', transactions: [] },
  '10': { visibility: 'private', transactions: [] },
  '11': { visibility: 'private', transactions: [] },
  '13': { visibility: 'private', transactions: [] },
  '14': { visibility: 'private', transactions: [] },
  '15': { visibility: 'private', transactions: [] },
};
