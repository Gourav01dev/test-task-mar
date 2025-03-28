import { supabase } from '../db/supabase';
import { SavingsGoal } from '../types';

export const savingsService = {
  // Get all savings goals
  async getSavingsGoals() {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .order('end_date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Add a new savings goal
  async addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert(goal)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update a savings goal
  async updateSavingsGoal(id: string, goal: Partial<SavingsGoal>) {
    const { data, error } = await supabase
      .from('savings_goals')
      .update(goal)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete a savings goal
  async deleteSavingsGoal(id: string) {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  // Update savings goal progress
  async updateGoalProgress(id: string, amount: number) {
    // First get current goal to add to current_amount
    const { data: goal, error: fetchError } = await supabase
      .from('savings_goals')
      .select('current_amount')
      .eq('id', id)
      .single();
    
    if (fetchError) throw fetchError;
    
    const newAmount = parseFloat(goal.current_amount) + amount;
    
    const { data, error } = await supabase
      .from('savings_goals')
      .update({ current_amount: newAmount })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};