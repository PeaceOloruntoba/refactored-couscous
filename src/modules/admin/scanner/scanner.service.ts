import { ScannerRepo } from './scanner.repo.js';

export class ScannerService {
  static async verifyTicket(ticketId: string) {
    const ticket = await ScannerRepo.verifyTicket(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    return ticket;
  }

  static async validateTicket(ticketId: string) {
    const ticket = await ScannerRepo.validateBoarding(ticketId);
    if (!ticket) {
      const current = await ScannerRepo.verifyTicket(ticketId);
      if (!current) throw new Error('Ticket not found');
      if (current.status === 'used') throw new Error('Ticket already used');
      if (current.status === 'cancelled') throw new Error('Ticket is cancelled');
      throw new Error('Ticket cannot be validated');
    }
    return ticket;
  }
}
