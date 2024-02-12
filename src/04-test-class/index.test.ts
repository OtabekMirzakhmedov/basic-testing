import { BankAccount, InsufficientFundsError, TransferFailedError, SynchronizationFailedError } from './';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = new BankAccount(100);
    expect(() => account.withdraw(200)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const fromAccount = new BankAccount(100);
    const toAccount = new BankAccount(0);
    expect(() => fromAccount.transfer(200, toAccount)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const account = new BankAccount(100);
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = new BankAccount(100);
    const depositAmount = 50;
    account.deposit(depositAmount);
    expect(account.getBalance()).toBe(150);
  });

  test('should withdraw money', () => {
    const account = new BankAccount(100);
    const withdrawalAmount = 50;
    account.withdraw(withdrawalAmount);
    expect(account.getBalance()).toBe(50);
  });

  test('should transfer money', () => {
    const fromAccount = new BankAccount(100);
    const toAccount = new BankAccount(0);
    const transferAmount = 50;
    fromAccount.transfer(transferAmount, toAccount);
    expect(fromAccount.getBalance()).toBe(50);
    expect(toAccount.getBalance()).toBe(50);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = new BankAccount(100);
    const balance = await account.fetchBalance();
    expect(typeof balance).toBe('number');
  });

  test('should set new balance if fetchBalance returned number', async () => {
    // Write your test here
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = new BankAccount(100);
    account.fetchBalance = async () => null;
    await expect(account.synchronizeBalance()).rejects.toThrow(SynchronizationFailedError);
  });
});
