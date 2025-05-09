import {
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = new BankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = new BankAccount(50);
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );
  });

  test('should throw error when transferring more than balance', () => {
    const sourceAccount = new BankAccount(50);
    const targetAccount = new BankAccount(0);

    expect(() => sourceAccount.transfer(100, targetAccount)).toThrow(
      InsufficientFundsError,
    );
    expect(() => sourceAccount.transfer(100, targetAccount)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );

    // Verify balances remain unchanged
    expect(sourceAccount.getBalance()).toBe(50);
    expect(targetAccount.getBalance()).toBe(0);
  });

  test('should throw error when transferring to the same account', () => {
    const account = new BankAccount(100);

    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');

    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    const account = new BankAccount(100);

    account.deposit(50);
    expect(account.getBalance()).toBe(150);

    account.deposit(25).deposit(25);
    expect(account.getBalance()).toBe(200);
  });

  test('should withdraw money', () => {
    const account = new BankAccount(100);

    account.withdraw(30);
    expect(account.getBalance()).toBe(70);

    account.withdraw(20).withdraw(10);
    expect(account.getBalance()).toBe(40);
  });

  test('should transfer money', () => {
    const sourceAccount = new BankAccount(100);
    const targetAccount = new BankAccount(50);

    sourceAccount.transfer(30, targetAccount);

    expect(sourceAccount.getBalance()).toBe(70);
    expect(targetAccount.getBalance()).toBe(80);

    sourceAccount.transfer(20, targetAccount).deposit(10);

    expect(sourceAccount.getBalance()).toBe(60);
    expect(targetAccount.getBalance()).toBe(100);
  });

  test('fetchBalance should return number in case if request did not fail', async () => {
    const account = new BankAccount(100);

    (random as jest.Mock).mockReturnValueOnce(75);
    (random as jest.Mock).mockReturnValueOnce(1);

    const result = await account.fetchBalance();

    expect(result).toBe(75);
    expect(account.getBalance()).toBe(100);
  });

  test('fetchBalance should return null if request failed', async () => {
    const account = new BankAccount(100);

    (random as jest.Mock).mockReturnValueOnce(75);
    (random as jest.Mock).mockReturnValueOnce(0);

    const result = await account.fetchBalance();

    expect(result).toBeNull();
    expect(account.getBalance()).toBe(100);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = new BankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(150);

    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(150);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = new BankAccount(100);

    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );

    expect(account.getBalance()).toBe(100);
  });
});
