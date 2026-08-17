/**
 * Credits System Tests
 * Etapa 9.18 - Fortalecimento do Motor de Consultas
 *
 * Testes para o sistema de créditos
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { CreditsService, resetCreditsService } from '@/lib/consultations/credits'

describe('CreditsService', () => {
  let credits: CreditsService

  beforeEach(() => {
    resetCreditsService()
    credits = new CreditsService()
  })

  describe('getQueryCost()', () => {
    it('should return cost for mock provider (free)', () => {
      const cost = credits.getQueryCost('cpf', 'mock')
      expect(cost).toBe(0)
    })

    it('should return null for disabled provider', () => {
      const cost = credits.getQueryCost('cpf', 'serasa')
      expect(cost).toBeNull()
    })

    it('should return cost for enabled provider', () => {
      // Habilita serasa para teste
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 100,
        providerType: 'serasa',
        enabled: true,
        description: 'Test',
      })

      const cost = credits.getQueryCost('cpf', 'serasa')
      expect(cost).toBe(100)
    })
  })

  describe('getBalance()', () => {
    it('should create initial balance for new user', async () => {
      const balance = await credits.getBalance('user-123')

      expect(balance.userId).toBe('user-123')
      expect(balance.balance).toBe(1000) // 1000 créditos iniciais
      expect(balance.totalUsed).toBe(0)
      expect(balance.totalGranted).toBe(1000)
    })

    it('should return existing balance', async () => {
      const balance1 = await credits.getBalance('user-123')
      const balance2 = await credits.getBalance('user-123')

      expect(balance1).toBe(balance2)
    })
  })

  describe('checkBalance()', () => {
    it('should return sufficient for mock queries', async () => {
      const result = await credits.checkBalance('user-123', 'cpf', 'mock')

      expect(result.sufficient).toBe(true)
      expect(result.requiredCredits).toBe(0)
      expect(result.message).toContain('mock')
    })

    it('should return insufficient for disabled provider', async () => {
      const result = await credits.checkBalance('user-123', 'cpf', 'serasa')

      expect(result.sufficient).toBe(false)
      expect(result.message).toContain('não disponível')
    })

    it('should return sufficient when balance is enough', async () => {
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 50,
        providerType: 'test',
        enabled: true,
        description: 'Test',
      })

      const result = await credits.checkBalance('user-123', 'cpf', 'test')

      expect(result.sufficient).toBe(true)
      expect(result.requiredCredits).toBe(50)
    })
  })

  describe('debit()', () => {
    it('should not debit for mock queries', async () => {
      const balanceBefore = await credits.getBalance('user-123')

      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-123',
        queryType: 'cpf',
        providerType: 'mock',
        amount: 1,
      })

      expect(transaction.amount).toBe(0)
      expect(transaction.status).toBe('completed')

      const balanceAfter = await credits.getBalance('user-123')
      expect(balanceAfter.balance).toBe(balanceBefore.balance)
    })

    it('should debit for real providers', async () => {
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 100,
        providerType: 'test',
        enabled: true,
        description: 'Test',
      })

      const balanceBefore = await credits.getBalance('user-123')
      const initialBalance = balanceBefore.balance // Should be 1000

      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-123',
        queryType: 'cpf',
        providerType: 'test',
        amount: 100,
      })

      expect(transaction.amount).toBe(-100)
      expect(transaction.status).toBe('completed')

      const balanceAfter = await credits.getBalance('user-123')
      expect(balanceAfter.balance).toBe(initialBalance - 100)
      expect(balanceAfter.totalUsed).toBe(100)
    })
  })

  describe('refund()', () => {
    it('should refund debited credits', async () => {
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 100,
        providerType: 'test',
        enabled: true,
        description: 'Test',
      })

      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-123',
        queryType: 'cpf',
        providerType: 'test',
        amount: 100,
      })

      const balanceAfterDebit = await credits.getBalance('user-123')
      expect(balanceAfterDebit.balance).toBe(900)

      const refund = await credits.refund(transaction.id, 'Erro no provider')

      expect(refund).not.toBeNull()
      expect(refund?.amount).toBe(100)
      expect(refund?.status).toBe('completed')

      const balanceAfterRefund = await credits.getBalance('user-123')
      expect(balanceAfterRefund.balance).toBe(1000)
      expect(balanceAfterRefund.totalRefunded).toBe(100)
    })

    it('should not refund same transaction twice', async () => {
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 100,
        providerType: 'test',
        enabled: true,
        description: 'Test',
      })

      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-123',
        queryType: 'cpf',
        providerType: 'test',
        amount: 100,
      })

      await credits.refund(transaction.id, 'First refund')

      const secondRefund = await credits.refund(transaction.id, 'Second refund')

      expect(secondRefund).toBeNull()
    })

    it('should not refund mock transactions', async () => {
      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-123',
        queryType: 'cpf',
        providerType: 'mock',
        amount: 0,
      })

      const refund = await credits.refund(transaction.id, 'Test')

      expect(refund).toBeNull()
    })
  })

  describe('listTransactions()', () => {
    it('should list user transactions', async () => {
      await credits.debit('user-123', {
        consultationId: 'cons-1',
        queryType: 'cpf',
        providerType: 'mock',
        amount: 0,
      })

      await credits.debit('user-123', {
        consultationId: 'cons-2',
        queryType: 'inss',
        providerType: 'mock',
        amount: 0,
      })

      const transactions = await credits.listTransactions('user-123')

      expect(transactions).toHaveLength(2)
    })

    it('should filter by type', async () => {
      credits.setQueryCost({
        queryType: 'cpf',
        baseCost: 100,
        providerType: 'test',
        enabled: true,
        description: 'Test',
      })

      await credits.debit('user-123', {
        consultationId: 'cons-1',
        queryType: 'cpf',
        providerType: 'mock',
        amount: 0,
      })

      const transaction = await credits.debit('user-123', {
        consultationId: 'cons-2',
        queryType: 'cpf',
        providerType: 'test',
        amount: 100,
      })

      await credits.refund(transaction.id, 'Test')

      const allTransactions = await credits.listTransactions('user-123')
      expect(allTransactions).toHaveLength(3) // 2 debits + 1 refund

      const refunds = await credits.listTransactions('user-123', { type: 'refund' })
      expect(refunds).toHaveLength(1)
    })
  })

  describe('clear()', () => {
    it('should clear all data', async () => {
      await credits.debit('user-123', {
        consultationId: 'cons-1',
        queryType: 'cpf',
        providerType: 'mock',
        amount: 0,
      })

      credits.clear()

      const balance = await credits.getBalance('user-123')
      expect(balance.balance).toBe(1000) // Novo saldo inicial
    })
  })
})
