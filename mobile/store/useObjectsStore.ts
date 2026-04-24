import { create } from 'zustand';
import { mockObjects } from '../data/mockObjects';
import { createSkeletonObject } from '../data/createSkeletonObject';
import type { CreateObjectInput, InvestmentObject } from '../types/models';
import { computeDashboard, computeUpcomingTasks, type DashboardStats, type UpcomingTask } from './dashboard';

interface ObjectsStore {
  objects: InvestmentObject[];
  /** Агрегаты для главной (пересчитываются при изменении списка). */
  getDashboard: () => DashboardStats;
  getUpcomingTasks: () => UpcomingTask[];
  getById: (id: string) => InvestmentObject | undefined;
  addObject: (input: CreateObjectInput) => string;
}

export const useObjectsStore = create<ObjectsStore>((set, get) => ({
  objects: mockObjects,

  getDashboard: () => computeDashboard(get().objects),

  getUpcomingTasks: () => computeUpcomingTasks(get().objects),

  getById: (id) => get().objects.find((o) => o.id === id),

  addObject: (input) => {
    const created = createSkeletonObject(input);
    set((s) => ({ objects: [created, ...s.objects] }));
    return created.id;
  },
}));
