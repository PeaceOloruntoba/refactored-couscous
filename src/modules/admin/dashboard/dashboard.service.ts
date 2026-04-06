import { DashboardRepo } from './dashboard.repo.js';

export class DashboardService {
  static async getDashboardData() {
    const [stats, weeklyStats, routeDistribution] = await Promise.all([
      DashboardRepo.getStats(),
      DashboardRepo.getWeeklyStats(),
      DashboardRepo.getRouteDistribution()
    ]);

    return {
      stats,
      weeklyStats,
      routeDistribution
    };
  }
}
