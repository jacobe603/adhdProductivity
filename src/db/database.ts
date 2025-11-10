// IndexedDB wrapper for local-first storage
// All data lives on device - privacy-first, works offline

import {
  EnergyEntry,
  InterventionLog,
  IfThenPlan,
  CheckInEntry,
  MedicationLog,
  Task,
} from '../types';

const DB_NAME = 'adhd-productivity-db';
const DB_VERSION = 2; // Incremented for Phase 2 task management

export class LocalDatabase {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Energy tracking store
        if (!db.objectStoreNames.contains('energy')) {
          const energyStore = db.createObjectStore('energy', {
            keyPath: 'id',
            autoIncrement: true,
          });
          energyStore.createIndex('timestamp', 'timestamp', { unique: false });
          energyStore.createIndex('timeOfDay', 'timeOfDay', { unique: false });
        }

        // Intervention logs store
        if (!db.objectStoreNames.contains('interventions')) {
          const interventionStore = db.createObjectStore('interventions', {
            keyPath: 'id',
            autoIncrement: true,
          });
          interventionStore.createIndex('timestamp', 'timestamp', { unique: false });
          interventionStore.createIndex('interventionId', 'interventionId', { unique: false });
        }

        // If-then plans store
        if (!db.objectStoreNames.contains('ifThenPlans')) {
          const planStore = db.createObjectStore('ifThenPlans', {
            keyPath: 'id',
            autoIncrement: true,
          });
          planStore.createIndex('isActive', 'isActive', { unique: false });
          planStore.createIndex('category', 'category', { unique: false });
        }

        // Check-in entries store
        if (!db.objectStoreNames.contains('checkIns')) {
          const checkInStore = db.createObjectStore('checkIns', {
            keyPath: 'id',
            autoIncrement: true,
          });
          checkInStore.createIndex('timestamp', 'timestamp', { unique: false });
          checkInStore.createIndex('timeOfDay', 'timeOfDay', { unique: false });
        }

        // Medication logs store
        if (!db.objectStoreNames.contains('medication')) {
          const medStore = db.createObjectStore('medication', {
            keyPath: 'id',
            autoIncrement: true,
          });
          medStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Tasks store (Phase 2)
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', {
            keyPath: 'id',
            autoIncrement: true,
          });
          taskStore.createIndex('priority', 'priority', { unique: false });
          taskStore.createIndex('completed', 'completed', { unique: false });
          taskStore.createIndex('createdAt', 'createdAt', { unique: false });
          taskStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };
    });
  }

  // === Energy Tracking Methods ===

  async saveEnergyEntry(entry: Omit<EnergyEntry, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['energy'], 'readwrite');
      const store = transaction.objectStore('energy');
      const request = store.add({
        ...entry,
        timestamp: entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getEnergyEntries(days: number = 14): Promise<EnergyEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['energy'], 'readonly');
      const store = transaction.objectStore('energy');
      const index = store.index('timestamp');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const range = IDBKeyRange.lowerBound(cutoffDate);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        resolve(entries);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getEnergyEntriesByTimeOfDay(
    timeOfDay: EnergyEntry['timeOfDay'],
    days: number = 14
  ): Promise<EnergyEntry[]> {
    const allEntries = await this.getEnergyEntries(days);
    return allEntries.filter((entry) => entry.timeOfDay === timeOfDay);
  }

  // === Intervention Tracking Methods ===

  async saveInterventionLog(log: Omit<InterventionLog, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['interventions'], 'readwrite');
      const store = transaction.objectStore('interventions');
      const request = store.add({
        ...log,
        timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getInterventionLogs(days: number = 30): Promise<InterventionLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['interventions'], 'readonly');
      const store = transaction.objectStore('interventions');
      const index = store.index('timestamp');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const range = IDBKeyRange.lowerBound(cutoffDate);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const logs = request.result.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        resolve(logs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateInterventionEffectiveness(
    id: number,
    effectiveness: number,
    contextAfter: InterventionLog['contextAfter']
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['interventions'], 'readwrite');
      const store = transaction.objectStore('interventions');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const log = getRequest.result;
        if (log) {
          log.effectiveness = effectiveness;
          log.contextAfter = contextAfter;
          const updateRequest = store.put(log);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Intervention log not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // === If-Then Plans Methods ===

  async saveIfThenPlan(plan: Omit<IfThenPlan, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ifThenPlans'], 'readwrite');
      const store = transaction.objectStore('ifThenPlans');
      const request = store.add({
        ...plan,
        createdAt: plan.createdAt instanceof Date ? plan.createdAt : new Date(plan.createdAt),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getActivePlans(): Promise<IfThenPlan[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ifThenPlans'], 'readonly');
      const store = transaction.objectStore('ifThenPlans');
      const index = store.index('isActive');
      const range = IDBKeyRange.only(true);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const plans = request.result.map(plan => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
        }));
        resolve(plans);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllPlans(): Promise<IfThenPlan[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ifThenPlans'], 'readonly');
      const store = transaction.objectStore('ifThenPlans');
      const request = store.getAll();

      request.onsuccess = () => {
        const plans = request.result.map(plan => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
        }));
        resolve(plans);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updatePlanUsage(id: number, success: boolean): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ifThenPlans'], 'readwrite');
      const store = transaction.objectStore('ifThenPlans');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const plan = getRequest.result;
        if (plan) {
          plan.timesUsed += 1;

          // Update success rate
          const currentSuccesses = plan.successRate
            ? Math.round((plan.successRate / 100) * (plan.timesUsed - 1))
            : 0;
          const newSuccesses = currentSuccesses + (success ? 1 : 0);
          plan.successRate = Math.round((newSuccesses / plan.timesUsed) * 100);

          const updateRequest = store.put(plan);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Plan not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async togglePlanActive(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['ifThenPlans'], 'readwrite');
      const store = transaction.objectStore('ifThenPlans');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const plan = getRequest.result;
        if (plan) {
          plan.isActive = !plan.isActive;
          const updateRequest = store.put(plan);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Plan not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // === Check-in Methods ===

  async saveCheckIn(entry: Omit<CheckInEntry, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['checkIns'], 'readwrite');
      const store = transaction.objectStore('checkIns');
      const request = store.add({
        ...entry,
        timestamp: entry.timestamp instanceof Date ? entry.timestamp : new Date(entry.timestamp),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getCheckIns(days: number = 14): Promise<CheckInEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['checkIns'], 'readonly');
      const store = transaction.objectStore('checkIns');
      const index = store.index('timestamp');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const range = IDBKeyRange.lowerBound(cutoffDate);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const entries = request.result.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        resolve(entries);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // === Medication Tracking Methods ===

  async saveMedicationLog(log: Omit<MedicationLog, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['medication'], 'readwrite');
      const store = transaction.objectStore('medication');
      const request = store.add({
        ...log,
        timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getTodayMedication(): Promise<MedicationLog[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['medication'], 'readonly');
      const store = transaction.objectStore('medication');
      const index = store.index('timestamp');

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const range = IDBKeyRange.bound(today, tomorrow, false, true);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const logs = request.result.map(log => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }));
        resolve(logs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // === Task Management Methods (Phase 2) ===

  async saveTask(task: Omit<Task, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.add({
        ...task,
        createdAt: task.createdAt instanceof Date ? task.createdAt : new Date(task.createdAt),
        completedAt: task.completedAt ? (task.completedAt instanceof Date ? task.completedAt : new Date(task.completedAt)) : undefined,
      });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (task) {
          const updatedTask = {
            ...task,
            ...updates,
            completedAt: updates.completedAt ? (updates.completedAt instanceof Date ? updates.completedAt : new Date(updates.completedAt)) : task.completedAt,
          };
          const updateRequest = store.put(updatedTask);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Task not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getTodayTasks(): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const request = store.getAll();

      request.onsuccess = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tasks = request.result
          .filter((task: Task) => {
            const createdDate = new Date(task.createdAt);
            createdDate.setHours(0, 0, 0, 0);
            return createdDate.getTime() === today.getTime() || !task.completed;
          })
          .map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          }));

        resolve(tasks);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getTasksByPriority(priority: 'must-do' | 'want-to'): Promise<Task[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      const index = store.index('priority');
      const range = IDBKeyRange.only(priority);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const tasks = request.result
          .filter((task: Task) => !task.completed)
          .map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          }));
        resolve(tasks);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async completeTask(id: number, energyLevel?: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const task = getRequest.result;
        if (task) {
          task.completed = true;
          task.completedAt = new Date();
          if (energyLevel) {
            task.energyLevelAtCompletion = energyLevel;
          }
          const updateRequest = store.put(task);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('Task not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // === Utility Methods ===

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const storeNames = ['energy', 'interventions', 'ifThenPlans', 'checkIns', 'medication', 'tasks'];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeNames, 'readwrite');

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      storeNames.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        store.clear();
      });
    });
  }

  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Export singleton instance
export const db = new LocalDatabase();
